const request = require('supertest');
const app = require('../../../src/app');
const testhelper = require('../../helper/fixtureHelper');
const webservicesProductOffersAssembler = require('../../../src/backends/webservices/webservicesProductOffersAssembler');
const mockWebservicesClient = require('../../../test/helpers/webserviceMockClient').createMockWebserviceClientWithPhoneConfig();

beforeAll(() => {
    process.env = Object.assign(process.env, {BACKEND: "webservices"});
});

describe("list selection tests", () => {
    let clientData;
    test("should respond with selection lists", async () => {
        clientData = await testhelper.createAndPersistPhoneClientWithWebservicesConfiguration();
        const productOffers = await webservicesProductOffersAssembler.updateAllProductOffersForClient(clientData, undefined, mockWebservicesClient);

        const shopShoppingCart = [
            {
                name: "Test Produkt",
                manufacturer: "Testhersteller",
                deviceClass: "Test",
                price: 69900,
                orderItemId: "9acf47bb-8fb9-46cc-a366-affedcd508c8",
                imageLink: "https://imageDomain.com/produktimage.jpg"
            },
            {
                name: "Test Produkt2",
                manufacturer: "Testhersteller",
                deviceClass: "Nicht unterstützt",
                price: 69900,
                orderItemId: "343a5c30-3e57-4ed3-98f6-1836990c138d",
                imageLink: "https://imageDomain.com/produktimage.jpg"
            },
            {
                name: "Test Produkt3",
                manufacturer: "Testhersteller",
                deviceClass: "Test",
                price: 69900,
                orderItemId: "43d21370-9371-43de-b8fe-5a16435ebc54",
                imageLink: "https://imageDomain.com/produktimage.jpg"
            },
        ];

        const base64ShopShoppingCart = Buffer.from(JSON.stringify(shopShoppingCart)).toString('base64');

        const result = await request(app).put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/list-selection`).send({
            shopShoppingCart: base64ShopShoppingCart
        });
        expect(result.status).toEqual(200);
        expect(result.body).toEqual({
            "insurableProductRows": [
                {
                    "shopProductImageLink": "https://imageDomain.com/produktimage.jpg",
                    "shopProductName": "Test Produkt",
                    "embeddedSelectionData": {
                        "texts": {
                            "title": "Extra Schutz? Jetzt direkt prüfen",
                            "documents": {
                                "PIS": "Produktinformationsblatt",
                                "ROW": "Widerrufsrecht",
                                "GDPR": "Datenschutz",
                                "GTCI": "Allgemeine Versicherungsbedingungen",
                                "IPID": "Informationsblatt für Versicherungsprodukte"
                            },
                            "footerHtml": "Versicherung ist Vertrauenssache, deshalb setzt testClient neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>",
                            "includedTax": "*inkl. 19% Versicherungssteuer",
                            "partnerShop": "testClient",
                            "productTexts": {
                                "taxInformation": "(inkl. %s VerSt**)",
                                "paymentIntervals": {
                                    "yearly": "jährl.",
                                    "monthly": "monatl.",
                                    "quarterly": "vierteljährl.",
                                    "halfYearly": "habljährl."
                                }
                            },
                            "productPanelTitle": "Ihr Wertgarantie Rundumschutz",
                            "productFurtherInformation": "Weitere Informationen",
                            "productPanelDetailsHeader": "Weitere Vorteile",
                            "wertgarantieFurtherInfoHtml": "Mehr zur <a target=\"_blank\" href=\"%s\">Wertgarantie</a>"
                        },
                        "products": [
                            {
                                "paymentInterval": "monatl.",
                                "intervalCode": "monthly",
                                "id": productOffers[0].id,
                                "name": "Komplettschutz",
                                "shortName": "Basisschutz",
                                "top3": [
                                    {
                                        "included": true
                                    }
                                ],
                                "advantages": [],
                                "GTCIText": "Allgemeine Versicherungsbedingungen",
                                "GTCIUri": "undefined/wertgarantie/documents/9448f030d5684ed3d587aa4e6167a1fd918aa47b",
                                "IPIDText": "Informationsblatt für Versicherungsprodukte",
                                "IPIDUri": "undefined/wertgarantie/documents/8835ff3c803f3e7abc5d49527001678bb179cfaa",
                                "priceFormatted": "23,40 €",
                                "price": 2340,
                                "taxFormatted": "(inkl. 3,74 € VerSt**)",
                                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
                            },
                            {
                                "paymentInterval": "monatl.",
                                "intervalCode": "monthly",
                                "id": productOffers[1].id,
                                "name": "Komplettschutz mit Premium-Option",
                                "shortName": "Premiumschutz",
                                "top3": [
                                    {
                                        "included": true
                                    }
                                ],
                                "advantages": [],
                                "GTCIText": "Allgemeine Versicherungsbedingungen",
                                "GTCIUri": "undefined/wertgarantie/documents/9448f030d5684ed3d587aa4e6167a1fd918aa47b",
                                "IPIDText": "Informationsblatt für Versicherungsprodukte",
                                "IPIDUri": "undefined/wertgarantie/documents/8835ff3c803f3e7abc5d49527001678bb179cfaa",
                                "priceFormatted": "23,40 €",
                                "price": 2340,
                                "taxFormatted": "(inkl. 3,74 € VerSt**)",
                                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
                            }
                        ]
                    }
                },
                {
                    "shopProductImageLink": "https://imageDomain.com/produktimage.jpg",
                    "shopProductName": "Test Produkt3",
                    "embeddedSelectionData": {
                        "texts": {
                            "title": "Extra Schutz? Jetzt direkt prüfen",
                            "documents": {
                                "PIS": "Produktinformationsblatt",
                                "ROW": "Widerrufsrecht",
                                "GDPR": "Datenschutz",
                                "GTCI": "Allgemeine Versicherungsbedingungen",
                                "IPID": "Informationsblatt für Versicherungsprodukte"
                            },
                            "footerHtml": "Versicherung ist Vertrauenssache, deshalb setzt testClient neben <strong>500.000 zufriedener Kunden</strong> auf die <strong>Wertgarantie</strong>, den <strong>Testsieger in Sachen Sicherheit</strong>",
                            "includedTax": "*inkl. 19% Versicherungssteuer",
                            "partnerShop": "testClient",
                            "productTexts": {
                                "taxInformation": "(inkl. %s VerSt**)",
                                "paymentIntervals": {
                                    "yearly": "jährl.",
                                    "monthly": "monatl.",
                                    "quarterly": "vierteljährl.",
                                    "halfYearly": "habljährl."
                                }
                            },
                            "productPanelTitle": "Ihr Wertgarantie Rundumschutz",
                            "productFurtherInformation": "Weitere Informationen",
                            "productPanelDetailsHeader": "Weitere Vorteile",
                            "wertgarantieFurtherInfoHtml": "Mehr zur <a target=\"_blank\" href=\"%s\">Wertgarantie</a>"
                        },
                        "products": [
                            {
                                "paymentInterval": "monatl.",
                                "intervalCode": "monthly",
                                "id": productOffers[0].id,
                                "name": "Komplettschutz",
                                "shortName": "Basisschutz",
                                "top3": [
                                    {
                                        "included": true
                                    }
                                ],
                                "advantages": [],
                                "GTCIText": "Allgemeine Versicherungsbedingungen",
                                "GTCIUri": "undefined/wertgarantie/documents/9448f030d5684ed3d587aa4e6167a1fd918aa47b",
                                "IPIDText": "Informationsblatt für Versicherungsprodukte",
                                "IPIDUri": "undefined/wertgarantie/documents/8835ff3c803f3e7abc5d49527001678bb179cfaa",
                                "priceFormatted": "23,40 €",
                                "price": 2340,
                                "taxFormatted": "(inkl. 3,74 € VerSt**)",
                                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
                            },
                            {
                                "paymentInterval": "monatl.",
                                "intervalCode": "monthly",
                                "id": productOffers[1].id,
                                "name": "Komplettschutz mit Premium-Option",
                                "shortName": "Premiumschutz",
                                "top3": [
                                    {
                                        "included": true
                                    }
                                ],
                                "advantages": [],
                                "GTCIText": "Allgemeine Versicherungsbedingungen",
                                "GTCIUri": "undefined/wertgarantie/documents/9448f030d5684ed3d587aa4e6167a1fd918aa47b",
                                "IPIDText": "Informationsblatt für Versicherungsprodukte",
                                "IPIDUri": "undefined/wertgarantie/documents/8835ff3c803f3e7abc5d49527001678bb179cfaa",
                                "priceFormatted": "23,40 €",
                                "price": 2340,
                                "taxFormatted": "(inkl. 3,74 € VerSt**)",
                                "imageLink": "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
                            }
                        ]
                    }
                }
            ],
            "listSelectionComponentTexts": {
                "title": "Extra Schutz? Jetzt direkt prüfen",
                "includedTax": "*inkl. 19% Versicherungssteuer",
                "partnerShop": "testClient",
                "addInsuranceButtonText": "Versicherungen hinzufügen"
            }
        });
    });

    test("should respond with 204 if not insurable products are submitted", async () => {
        const shopShoppingCart = [
            {
                name: "Test Produkt",
                manufacturer: "Testhersteller",
                deviceClass: "Nicht unterstützt",
                price: 69900,
                orderItemId: "9acf47bb-8fb9-46cc-a366-affedcd508c8",
                imageLink: "https://imageDomain.com/produktimage.jpg"
            },
            {
                name: "Test Produkt2",
                manufacturer: "Testhersteller",
                deviceClass: "Nicht unterstützt",
                price: 69900,
                orderItemId: "343a5c30-3e57-4ed3-98f6-1836990c138d",
                imageLink: "https://imageDomain.com/produktimage.jpg"
            },
            {
                name: "Test Produkt3",
                manufacturer: "Testhersteller",
                deviceClass: "nicht versicherbar",
                price: 69900,
                orderItemId: "43d21370-9371-43de-b8fe-5a16435ebc54",
                imageLink: "https://imageDomain.com/produktimage.jpg"
            },
        ];

        const base64ShopShoppingCart = Buffer.from(JSON.stringify(shopShoppingCart)).toString('base64');

        const result = await request(app).put(`/wertgarantie/ecommerce/clients/${clientData.publicClientIds[0]}/components/list-selection`).send({
            shopShoppingCart: base64ShopShoppingCart
        });
        expect(result.status).toEqual(204);
    });
});
