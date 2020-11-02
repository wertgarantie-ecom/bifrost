import {lockSchema} from './lockSchema';
import {BackgroundStyle, Lock, PaymentIntervalCode, Range} from "./webserviceProductOffersRepository";

export interface DeviceClassConfig {
    objectCode: string,
    objectCodeExternal: string
}

export interface WebservicesProductConfig {
    name: string,
    shortName: string,
    productType: string,
    applicationCode: string,
    basicRiskType: string,
    defaultPaymentInterval: PaymentIntervalCode,
    priceRanges: Range[],
    deviceClasses: DeviceClassConfig[],
    documents: {
        legalDocuments: string[]
    },
    advantages: string[],
    risks: string[],
    productImageLink: string,
    backgroundStyle: BackgroundStyle,
    lock: Lock
}


export const productOffersConfigSchema = {
    "type": "array",
    "items": {
        "type": "object",
        "required": [
            "name",
            "productType",
            "applicationCode",
            "basicRiskType",
            "deviceClasses",
            "documents",
            "advantages",
            "defaultPaymentInterval",
            "priceRanges",
            "risks",
            "productImageLink",
            "backgroundStyle"
        ],
        "properties": {
            "name": {
                "type": "string",
            },
            "productType": {
                "type": "string",
            },
            "applicationCode": {
                "type": "string",
            },
            "basicRiskType": {
                "type": "string",
            },
            "defaultPaymentInterval": {
                "type": "string",
                "enum": ["monthly", "quarterly", "halfYearly", "yearly"]
            },
            "priceRanges": {
                "type": "array",
                "additionalItems": true,
                "items": {
                    "type": "object",
                    "required": [
                        "minClose",
                        "maxOpen"
                    ],
                    "properties": {
                        "minClose": {
                            "type": "integer",
                        },
                        "maxOpen": {
                            "type": "integer",
                        }
                    }
                }
            },
            "deviceClasses": {
                "type": "array",
                "items": {
                    "type": "object",
                    "required": [
                        "objectCode",
                        "objectCodeExternal",
                    ],
                    "properties": {
                        "objectCode": {
                            "type": "string",
                        },
                        "objectCodeExternal": {
                            "type": "string",
                        }
                    }
                }
            },
            "documents": {
                "type": "object",
                "required": [
                    "legalDocuments"
                ],
                "properties": {
                    "legalDocuments": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                }
            },
            "advantages": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "risks": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "productImageLink": {
                "type": "string"
            },
            "backgroundStyle": {
                "type": "string",
                "enum": [
                    "primary",
                    "secondary"
                ]
            },
            "lock": lockSchema
        }
    }
};