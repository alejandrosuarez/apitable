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
* Other information
*/
export class NodeExtra {
    /**
    * DingTalk application status 0 means deactivated, 1 means enabled, 2 means deleted, and 3 means unpublished
    */
    'dingTalkDaStatus'?: number;
    /**
    * DingTalk isv suiteKey
    */
    'dingTalkSuiteKey'?: string;
    /**
    * DingTalk isv authorized Enterprise Id
    */
    'dingTalkCorpId'?: string;
    /**
    * Source template Id
    */
    'sourceTemplateId'?: string;
    /**
    * Whether to display the prompt of successful creation
    */
    'showTips'?: boolean;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "dingTalkDaStatus",
            "baseName": "dingTalkDaStatus",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "dingTalkSuiteKey",
            "baseName": "dingTalkSuiteKey",
            "type": "string",
            "format": ""
        },
        {
            "name": "dingTalkCorpId",
            "baseName": "dingTalkCorpId",
            "type": "string",
            "format": ""
        },
        {
            "name": "sourceTemplateId",
            "baseName": "sourceTemplateId",
            "type": "string",
            "format": ""
        },
        {
            "name": "showTips",
            "baseName": "showTips",
            "type": "boolean",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return NodeExtra.attributeTypeMap;
    }

    public constructor() {
    }
}
