package com.vikadata.api.modular.base.service.impl;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.imageio.ImageIO;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.SpaceAssetDTO;
import com.vikadata.api.cache.service.IAssetCacheService;
import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.enums.attach.AssetUploadSource;
import com.vikadata.api.enums.exception.ActionException;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.model.dto.space.SpaceAssetDto;
import com.vikadata.api.model.ro.asset.AssetQiniuUploadCallbackBody;
import com.vikadata.api.model.vo.asset.AssetUploadResult;
import com.vikadata.api.modular.base.mapper.AssetMapper;
import com.vikadata.api.modular.base.mapper.DeveloperAssetMapper;
import com.vikadata.api.modular.base.service.IAssetAuditService;
import com.vikadata.api.modular.base.service.IAssetCallbackService;
import com.vikadata.api.modular.space.mapper.SpaceAssetMapper;
import com.vikadata.api.modular.space.service.ISpaceAssetService;
import com.vikadata.api.util.PdfToImageUtil;
import com.vikadata.api.util.StringUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.define.utils.DigestUtil;
import com.vikadata.define.utils.InputStreamCache;
import com.vikadata.define.utils.MimeTypeMapping;
import com.vikadata.entity.AssetEntity;
import com.vikadata.integration.oss.OssClientTemplate;
import com.vikadata.integration.oss.OssStatObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.AssetsPublicConstants.IMAGE_PREFIX;
import static com.vikadata.api.constants.AssetsPublicConstants.SPACE_PREFIX;
import static com.vikadata.api.enums.exception.DatabaseException.EDIT_ERROR;

/**
 * <p>
 * 基础-附件回调 服务实现类
 * </p>
 *
 * @author Pengap
 * @date 2022/4/6 16:46:25
 */
@Slf4j
@Service
public class AssetCallbackServiceImpl implements IAssetCallbackService {

    @Resource
    private AssetMapper assetMapper;

    @Resource
    private DeveloperAssetMapper developerAssetMapper;

    @Resource
    private IAssetAuditService iAssetAuditService;

    @Resource
    private ISpaceAssetService iSpaceAssetService;

    @Resource
    private SpaceAssetMapper spaceAssetMapper;

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Resource
    private IAssetCacheService iAssetCacheService;

    @Deprecated
    @Override
    @Transactional(rollbackFor = Exception.class)
    public AssetUploadResult qiniuCallback(AssetQiniuUploadCallbackBody body) {
        AssetUploadSource uploadSource = AssetUploadSource.of(body.getUploadSource());
        switch (uploadSource) {
            case WIDGET_STATIC:
                this.completeWidgetStaticUpload(body);
                break;
            case SPACE_ASSET:
                return this.completeSpaceAssetUpload(body);
        }
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<AssetUploadResult> loadAssetUploadResult(AssetType assetType, List<String> resourceKeys) {
        // 非空间资源，只会用到文件访问路径
        if (!AssetType.isSpaceAsset(assetType)) {
            return resourceKeys.stream().map(AssetUploadResult::new).collect(Collectors.toList());
        }
        // 获取资源库中 file_url 已经存在的附件
        List<AssetEntity> assetEntities = assetMapper.selectByFileUrl(resourceKeys);
        if (assetEntities.size() != resourceKeys.size()) {
            throw new BusinessException("resource don't exist");
        }
        List<AssetUploadResult> results = new ArrayList<>(resourceKeys.size());
        for (AssetEntity asset : assetEntities) {
            // 判断 md5 是否已存在，已存在说明数据库中资源记录信息完整，直接返回；若不存在则请求加载OSS，补全资源记录信息
            if (asset.getChecksum() != null) {
                AssetUploadResult result = BeanUtil.copyProperties(asset, AssetUploadResult.class);
                result.setToken(asset.getFileUrl());
                result.setSize(asset.getFileSize().longValue());
                results.add(result);
                continue;
            }
            // 获取文件属性
            OssStatObject statObject = ossTemplate.getStatObject(asset.getBucketName(), asset.getFileUrl());
            // 检查限制的文件类型
            this.checkFileType(statObject.getMimeType(), asset.getId(), asset.getBucketName(), asset.getFileUrl());
            // 构建回调信息
            AssetQiniuUploadCallbackBody body = new AssetQiniuUploadCallbackBody();
            body.setUploadAssetId(asset.getId());
            body.setBucket(asset.getBucketName());
            body.setBucketType(asset.getBucket());
            body.setKey(asset.getFileUrl());
            body.setHash(statObject.getHash());
            body.setFsize(statObject.getFileSize());
            body.setMimeType(statObject.getMimeType());
            body.setAssetType(assetType.getValue());
            if (assetType != AssetType.DATASHEET) {
                // 加载缓存数据
                SpaceAssetDTO spaceAssetDTO = iAssetCacheService.getSpaceAssetDTO(asset.getFileUrl());
                BeanUtil.copyProperties(spaceAssetDTO, body);
            }
            // 资源上传处理
            AssetUploadResult result = this.dealWithAssetUpload(body, false);
            results.add(result);
        }
        return results;
    }

    private void checkFileType(String mimeType, Long id, String bucketName, String key) {
        // 非限制类型，结束返回
        if (!MediaType.TEXT_HTML_VALUE.equals(mimeType)) {
            return;
        }
        // 限制的文件类型，将本次上传的数据清除
        ossTemplate.delete(bucketName, key);
        assetMapper.deleteById(id);
        throw new BusinessException(ActionException.FILE_NOT_SUPPORT_HTML);
    }

    @Transactional(rollbackFor = Throwable.class)
    public AssetUploadResult completeSpaceAssetUpload(AssetQiniuUploadCallbackBody body) {
        // 资源上传处理
        AssetUploadResult result = this.dealWithAssetUpload(body, true);
        result.setName(body.getFname());
        return result;
    }

    private AssetUploadResult dealWithAssetUpload(AssetQiniuUploadCallbackBody body, boolean createAudit) {
        AssetUploadResult result = new AssetUploadResult();
        // 锁住 hash，防止并发上传相同的新附件
        Lock lock = redisLockRegistry.obtain(body.getHash());
        try {
            if (lock.tryLock(1, TimeUnit.MINUTES)) {
                AssetType assetType = AssetType.of(body.getAssetType());
                AssetEntity assetEntity = assetMapper.selectByChecksum(body.getHash());
                // 不存在相同附件，更新补全本次上传的资源数据
                if (ObjectUtil.isNull(assetEntity)) {
                    AssetEntity entity = this.supplementAssetEntity(body);
                    BeanUtil.copyProperties(entity, result);
                    result.setBucket(body.getBucketType());
                    result.setSize(body.getFsize());
                    result.setToken(body.getKey());
                    // 如果是图片，需要创建审核记录
                    if (createAudit && body.getMimeType().startsWith(IMAGE_PREFIX)) {
                        iAssetAuditService.create(body.getUploadAssetId(), body.getHash(), body.getKey());
                    }
                    // 数表的引用在op进行更新，无需在上传时更新引用数据
                    if (assetType != AssetType.DATASHEET) {
                        iSpaceAssetService.saveAssetInSpace(body.getSpaceId(), body.getNodeId(), body.getUploadAssetId(), body.getHash(), assetType, StrUtil.nullToEmpty(body.getFname()), body.getFsize());
                    }
                }
                else {
                    // 存在相同附件，沿用之前的数据，将本次上传的数据清除
                    BeanUtil.copyProperties(assetEntity, result);
                    result.setSize(assetEntity.getFileSize().longValue());
                    result.setToken(assetEntity.getFileUrl());
                    // 重复回调，直接返回结束
                    if (Objects.equals(assetEntity.getId(), body.getUploadAssetId())) {
                        return result;
                    }
                    ossTemplate.delete(body.getBucket(), body.getKey());
                    assetMapper.deleteById(body.getUploadAssetId());

                    if (assetType != AssetType.DATASHEET) {
                        // 判断是否已在该节点上引用该文件，是则累加一次引用次数，否则新增一条空间附件记录
                        SpaceAssetDto assetDto = spaceAssetMapper.selectDto(body.getSpaceId(), body.getNodeId(), assetEntity.getId());
                        if (ObjectUtil.isNotNull(assetDto)) {
                            // 一次作为封面图使用，空间资源记录便硬性记录类型为封面图，方便获取使用过的所有封面图
                            boolean flag = !assetDto.getType().equals(AssetType.COVER.getValue()) && assetType.equals(AssetType.COVER);
                            Integer type = flag ? AssetType.COVER.getValue() : null;
                            iSpaceAssetService.edit(assetDto.getId(), assetDto.getCite() + 1, type);
                        }
                        else {
                            iSpaceAssetService.saveAssetInSpace(body.getSpaceId(), body.getNodeId(), assetEntity.getId(), body.getHash(), assetType, StrUtil.nullToEmpty(body.getFname()), body.getFsize());
                        }
                    }
                }
            }
            else {
                log.error("上传操作过于频繁，请稍后重试。hash:{}", body.getHash());
                throw new BusinessException("上传操作过于频繁，请稍后重试");
            }
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        }
        finally {
            lock.unlock();
        }
        return result;
    }

    private AssetEntity supplementAssetEntity(AssetQiniuUploadCallbackBody body) {
        String mimeType = body.getMimeType();
        AssetEntity entity = new AssetEntity();
        entity.setId(body.getUploadAssetId());
        entity.setChecksum(body.getHash());
        entity.setFileSize(body.getFsize().intValue());
        entity.setHeight(body.getImageHeight());
        entity.setWidth(body.getImageWidth());
        entity.setMimeType(mimeType);
        entity.setExtensionName(MimeTypeMapping.mimeTypeToExtension(mimeType));
        // 若是 PDF 类型资源，生成预览图并上传
        if (MediaType.APPLICATION_PDF_VALUE.equals(mimeType)) {
            String pdfImgUploadPath = this.uploadAndSavePdfImg(body.getBucket(), body.getKey());
            entity.setPreview(pdfImgUploadPath);
        }
        else if (body.getImageHeight() == null && mimeType.startsWith(IMAGE_PREFIX)) {
            // 若是图片，解析图片的高宽
            this.appendImageInfo(body.getBucket(), body.getKey(), entity);
        }
        boolean flag = SqlHelper.retBool(assetMapper.updateById(entity));
        ExceptionUtil.isTrue(flag, EDIT_ERROR);
        return entity;
    }

    private String uploadAndSavePdfImg(String bucketName, String key) {
        AtomicReference<String> pdfImgUploadPath = new AtomicReference<>();
        ossTemplate.executeStreamFunction(bucketName, key,
                in -> {
                    InputStream imageIn = PdfToImageUtil.convert(in);
                    if (imageIn == null) {
                        return;
                    }
                    try (InputStreamCache pdfImgStreamCache = new InputStreamCache(imageIn, imageIn.available())) {
                        pdfImgUploadPath.set(StringUtil.buildPath(SPACE_PREFIX));
                        String pdfImgChecksum = DigestUtil.md5Hex(pdfImgStreamCache.getInputStream());
                        ossTemplate.upload(bucketName, pdfImgStreamCache.getInputStream(), pdfImgUploadPath.get(), MediaType.IMAGE_JPEG_VALUE, pdfImgChecksum);
                    }
                    catch (IOException e) {
                        log.error("PDF预览图资源上传失败", e);
                    }
                });
        return pdfImgUploadPath.get();
    }

    private void appendImageInfo(String bucketName, String key, AssetEntity entity) {
        // 若是图片，解析图片的高宽
        ossTemplate.executeStreamFunction(bucketName, key,
                in -> {
                    try {
                        BufferedImage bi = ImageIO.read(in);
                        if (bi != null) {
                            entity.setHeight(bi.getHeight());
                            entity.setWidth(bi.getWidth());
                        }
                    }
                    catch (IOException e) {
                        log.error("读取图片「{}」异常，错误信息:{}", key, e.getMessage());
                    }
                });
    }

    private void completeWidgetStaticUpload(AssetQiniuUploadCallbackBody body) {
        Long assetId = body.getUploadAssetId();
        Long developerAssetId = body.getUploadDeveloperAssetId();
        Long fsize = body.getFsize();

        boolean flag = SqlHelper.retBool(assetMapper.updateFileSizeById(assetId, fsize));
        flag &= SqlHelper.retBool(developerAssetMapper.updateFileSizeById(developerAssetId, fsize));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

}
