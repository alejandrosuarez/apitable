# .InternalServiceNotificationInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create7**](InternalServiceNotificationInterfaceApi.md#create7) | **POST** /internal/notification/create | send a message


# **create7**
> ResponseDataVoid create7(notificationCreateRo)

send a message

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceNotificationInterfaceApi(configuration);

let body:.InternalServiceNotificationInterfaceApiCreate7Request = {
  // Array<NotificationCreateRo>
  notificationCreateRo: [
    {
      toUserId: [
        "toUserId_example",
      ],
      toMemberId: [
        "toMemberId_example",
      ],
      toUnitId: [
        "toUnitId_example",
      ],
      fromUserId: "1261273764218",
      nodeId: "nod10",
      spaceId: "spcHKrd0liUcl",
      templateId: "tplxx",
      body: 
        key: {},
      ,
      version: "v0.12.1.release",
      expireAt: "1614587900000",
      notifyId: "1614587900000",
    },
  ],
};

apiInstance.create7(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **notificationCreateRo** | **Array<NotificationCreateRo>**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

