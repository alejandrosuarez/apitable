/**
 * Api Document
 * Backend_Server Api Document
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { HttpFile } from '../http/http';

/**
* Product Price View
*/
export class ProductPriceVo {
    /**
    * production type
    */
    'product'?: string;
    /**
    * price id
    */
    'priceId'?: string;
    /**
    * seat
    */
    'seat'?: number;
    /**
    * seat description i18n key
    */
    'seatDescI18nName'?: string;
    /**
    * month
    */
    'month'?: number;
    /**
    * discount amount (unit: yuan)
    */
    'priceDiscount'?: number;
    /**
    * original price (unit: yuan)
    */
    'priceOrigin'?: number;
    /**
    * p`ayment amount (unit: yuan)
    */
    'pricePaid'?: number;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "product",
            "baseName": "product",
            "type": "string",
            "format": ""
        },
        {
            "name": "priceId",
            "baseName": "priceId",
            "type": "string",
            "format": ""
        },
        {
            "name": "seat",
            "baseName": "seat",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "seatDescI18nName",
            "baseName": "seatDescI18nName",
            "type": "string",
            "format": ""
        },
        {
            "name": "month",
            "baseName": "month",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "priceDiscount",
            "baseName": "priceDiscount",
            "type": "number",
            "format": ""
        },
        {
            "name": "priceOrigin",
            "baseName": "priceOrigin",
            "type": "number",
            "format": ""
        },
        {
            "name": "pricePaid",
            "baseName": "pricePaid",
            "type": "number",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return ProductPriceVo.attributeTypeMap;
    }

    public constructor() {
    }
}
