const addProductToShoppingCartWithOrderId = require('../../src/shoppingcart/shoppingCartService').addProductToShoppingCart;
const service = require('../../src/shoppingcart/shoppingCartService');
const productOffersTestResponses = require('../productoffer/productOffersTestResponses');
const signatureService = require('../../src/shoppingcart/signatureService');
const ClientError = require('../../src/errors/ClientError');
const uuid = require('uuid');
const validCustomer = require('../../integration-test/helper/fixtureHelper').validCustomer;
const clientConfig = require('../../integration-test/helper/fixtureHelper').createDefaultClient();
const getRequiredLockPrice = require('../../src/productoffers/productOffersService').getMinimumLockPriceForProduct;
const mockProductOfferServicePhone = {
    getProductOfferById: () => productOffersTestResponses.productOffersPhone[0]
};
const mockProductOfferServiceBike = {
    getProductOfferById: () => productOffersTestResponses.productOffersBike[0],
    getMinimumLockPriceForProduct: getRequiredLockPrice
};

const emptyChanges = {
    deleted: [],
    updated: []
};

function validProduct() {
    return {
        id: "9fd47b8a-f984-11e9-adcf-afabcc521083",
        shopProduct: {
            name: "Phone X",
            deviceClass: "Smartphone",
            price: 1200
        },
        wertgarantieProduct: {
            id: "1234",
            name: "Komplettschutz",
            paymentInterval: "monthly",
            shopProductCondition: "NEW"
        }
    };
}

const includedOrder = {
    id: "5f507954-fed1-45c9-aaa6-30f216d6f163",
    shopProduct: {
        name: "Phone X",
        deviceClass: "Smartphone",
        price: 1200
    },
    wertgarantieProduct: {
        id: "4543545",
        name: "Komplettschutz",
        paymentInterval: "monthly"
    }
};
const validShoppingCart = {
    publicClientId: "public:5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
    orders: [includedOrder],
    confirmations: {
        termsAndConditionsConfirmed: true
    }
};

test("should create and fill new shopping cart if no cart is given", async () => {
    const result = await addProductToShoppingCartWithOrderId(undefined, validProduct(), clientConfig, "9fd47b8a-f984-11e9-adcf-afabcc521083", mockProductOfferServicePhone);
    expect(result.shoppingCart.orders).toEqual([validProduct()]);
});

test("new created shopping cart should have given clientId", async () => {
    const result = await addProductToShoppingCartWithOrderId(undefined, validProduct(), clientConfig, "9fd47b8a-f984-11e9-adcf-afabcc521083", mockProductOfferServicePhone);
    expect(result.shoppingCart.publicClientId).toEqual(clientConfig.publicClientIds[0]);
});

test("should add product to existing shopping cart", async () => {
    const result = await addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), clientConfig, "9fd47b8a-f984-11e9-adcf-afabcc521083", mockProductOfferServicePhone);
    expect(result.shoppingCart.orders).toEqual([includedOrder, validProduct()]);
});


test("should allow duplicate products", async () => {
    const publicClientId = "public:" + uuid();
    const validShoppingCart = {
        publicClientId: publicClientId,
        orders: [validProduct()],
        confirmations: {
            termsAndConditionsConfirmed: false
        }
    };
    const result = await addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), publicClientId, "9fd47b8a-f984-11e9-adcf-afabcc521083", mockProductOfferServicePhone);
    expect(result.shoppingCart.orders).toEqual([validProduct(), validProduct()]);
});

test("should confirm valid shopping cart", () => {
    const publicClientId = "public:" + uuid();
    const validShoppingCart = {
        publicClientId: publicClientId,
        products: [validProduct()],
        confirmations: {
            termsAndConditionsConfirmed: true
        }
    };
    const confirmedShoppingCart = service.confirmAttribute(validShoppingCart, "termsAndConditionsConfirmed");

    expect(confirmedShoppingCart.confirmations.termsAndConditionsConfirmed).toEqual(true);
});

test("should unconfirm valid shopping cart", () => {
    const publicClientId = "public:" + uuid();
    const validShoppingCart = {
        publicClientId: publicClientId,
        products: [validProduct()],
        confirmations: {
            termsAndConditionsConfirmed: true
        }
    };
    const confirmedShoppingCart = service.unconfirmAttribute(validShoppingCart, "termsAndConditionsConfirmed");

    expect(confirmedShoppingCart.confirmations.termsAndConditionsConfirmed).toEqual(false);
});

test("added product should always reject confirmation", async () => {
    const addResult = await addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f", "9fd47b8a-f984-11e9-adcf-afabcc521083", mockProductOfferServicePhone);
    expect(addResult.shoppingCart.confirmations.termsAndConditionsConfirmed).toEqual(false);
});


test("on checkout call shop price differs from wertgarantie price", async () => {
    const wertgarantieShoppingCart = {
        sessionId: "619f7fda-d77e-4be1-b73c-db145402bcab",
        publicClientId: "public:5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        orders: [
            {
                wertgarantieProduct: {
                    id: "2",
                    name: "Basis",
                    price: "500",
                    paymentInterval: "monthly",
                    deviceClass: "9025",
                    shopDeviceClass: "Smartphone"

                },
                shopProduct: {
                    price: "1000",
                    name: "IPhone X",
                    deviceClasses: "Smartphone",
                },
                id: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ],
        confirmations: {
            termsAndConditionsConfirmed: true
        }
    };

    const purchasedProducts = [
        {
            price: "1200.93",
            manufacturer: "Apple Inc",
            deviceClasses: "Kühlschrank,Smartphone,ein Ponny",
            name: "IPhone X",
        }
    ];
    const customer = validCustomer();

    const mockClient = {
        submitInsuranceProposal: jest.fn(() => {
            throw new Error("you should never call me");
        })
    };

    const result = await service.checkoutShoppingCart(purchasedProducts,
        customer,
        undefined,
        wertgarantieShoppingCart,
        clientConfig,
        undefined,
        mockClient,
        generateIds(["2fcb053d-873c-4046-87e4-bbd75566901d"]),
        mockRepository);

    expect(result).toEqual({
        "sessionId": "619f7fda-d77e-4be1-b73c-db145402bcab",
        "traceId": "563e6720-5f07-42ad-99c3-a5104797f083",
        "clientId": clientConfig.id,
        "test": false,
        "purchases": [
            {
                "id": "2fcb053d-873c-4046-87e4-bbd75566901d",
                "wertgarantieProductId": "2",
                "wertgarantieProductName": "Basis",
                "shopDeviceClass": "Smartphone",
                "deviceClass": "9025",
                "devicePrice": "1000",
                "success": false,
                "wertgarantieProductPaymentInterval": "monthly",
                "wertgarantieProductPremium": "500",
                "message": "couldn't find matching product in shop cart for wertgarantie product",
                "shopProduct": "IPhone X",
                "availableShopProducts": [
                    {
                        "price": "1200.93",
                        "manufacturer": "Apple Inc",
                        "deviceClasses": [
                            "Kühlschrank",
                            "Smartphone",
                            "ein Ponny"
                        ],
                        "name": "IPhone X"
                    }
                ]
            }
        ]
    });
});

const mockRepository = {
    persist: () => undefined
};


function generateIds(ids) {
    return () => ids.pop();
}

test("checkout call executed without confirmation", async () => {
    const wertgarantieShoppingCart = {
        publicClientId: "public:5209d6ea-1a6e-11ea-9f8d-778f0ad9137f",
        orders: [
            {
                wertgarantieProduct: {
                    id: "2"
                },
                shopProduct: {
                    price: "1000",
                    deviceClass: "Bike",
                    name: "Super Bike"
                },
                id: "18ff0413-bcfd-48f8-b003-04b57762067a"
            }
        ]
    };

    const signedWertgarantieCart = signatureService.signShoppingCart(wertgarantieShoppingCart);

    const purchasedProducts = [
        {
            price: "1000",
            manufacturer: "Apple Inc",
            deviceClass: "Smartphone",
            name: "IPhone X",
            productId: "1"
        }
    ];
    const customer = validCustomer();
    const secretClientId = "bikesecret1";

    try {
        await service.checkoutShoppingCart(purchasedProducts, customer, signedWertgarantieCart, secretClientId);
        expect.fail();
    } catch (e) {
        expect(e).toBeInstanceOf(ClientError);
    }
});


test("should not update wertgarantieShoppingCart if no orderItemIds are available in wertgarantieShoppingCart", async () => {
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                name: "IPhone X",
                orderItemId: "orderItemId"
            }
        ];

        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: "18ff0413-bcfd-48f8-b003-04b57762067a",
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        name: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        paymentInterval: "monthly",
                        price: 500
                    }
                },
            ],
        };

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(result.shoppingCart.orders).toEqual(wertgarantieShoppingCart.orders);
        expect(result.changes).toEqual(emptyChanges);
    }
);

test("should keep wertgarantieShoppingCart if no shopShoppingCart is provided", async () => {
        const shopShoppingCart = undefined;

        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: "18ff0413-bcfd-48f8-b003-04b57762067a",
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId",
                        name: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
        };

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(result.shoppingCart.orders).toEqual(wertgarantieShoppingCart.orders);
        expect(result.changes).toEqual(emptyChanges);
    }
);

test("should keep wertgarantieShoppingCart orders if they match with shopShoppingCart orders", async () => {
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId1",
                name: "IPhone X"
            },
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId2",
                name: "IPhone X"
            }
        ];

        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: "18ff0413-bcfd-48f8-b003-04b57762067a",
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId1",
                        name: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
                {
                    id: "18ff0413-bcfd-48f8-b003-04b57762067a",
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId2",
                        name: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                }
            ],
        };

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(result.shoppingCart.orders).toEqual(wertgarantieShoppingCart.orders);
        expect(result.changes).toEqual(emptyChanges);
    }
);

test("should remove wertgarantieShoppingCart order with orderItemId if no match in shoppingCart was found", async () => {
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "anotherOrderItemId",
                name: "IPhone X"
            }
        ];

        const idToDelete = "18ff0413-bcfd-48f8-b003-04b57762067a";
        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: idToDelete,
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId",
                        name: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
            confirmations: {
                termsAndConditionsConfirmed: false
            }
        };

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart, undefined, mockProductOfferServicePhone);
        expect(result.shoppingCart.orders).toEqual([]);
        expect(result.changes.deleted).toEqual([idToDelete])
    }
);


test("should update wertgarantieShoppingCart order if price of matching shopShoppingCart item does not match", async () => {
        const updatedPrice = 20000;
        const shopShoppingCart = [
            {
                price: updatedPrice,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                name: "IPhone X"
            }
        ];

        const idToUpdate = "18ff0413-bcfd-48f8-b003-04b57762067a";
        const wertgarantieProductPrice = 500;
        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: idToUpdate,
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId",
                        name: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: wertgarantieProductPrice,
                        paymentInterval: "monthly"
                    }
                },
            ],
            confirmations: {
                termsAndConditionsConfirmed: false
            }
        };

        const mockProductOffersService = {
            getPriceForSelectedProductOffer: () => wertgarantieProductPrice,
            getProductOfferById: () => productOffersTestResponses.productOffersPhone[0]
        };
        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart, undefined, mockProductOffersService);
        expect(result.shoppingCart.orders[0].shopProduct.price).toEqual(updatedPrice);
        expect(result.changes.updated).toEqual([{
            id: idToUpdate,
            wertgarantieProductPriceChanged: false
        }]);
    }
);

test("should update price of wertgarantie product if price of matching shopShoppingCart item does not match", async () => {
        const updatedPrice = 20000;
        const shopShoppingCart = [
            {
                price: updatedPrice,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                name: "IPhone X"
            }
        ];

        const idToUpdate = "18ff0413-bcfd-48f8-b003-04b57762067a";
        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: idToUpdate,
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId",
                        name: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
            confirmations: {
                termsAndConditionsConfirmed: false
            }
        };
        const newWertgarantieProductPrice = 1000000;
        const mockProductOffersService = {
            getPriceForSelectedProductOffer: () => newWertgarantieProductPrice,
            getProductOfferById: () => productOffersTestResponses.productOffersPhone[0]
        };
        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart, undefined, mockProductOffersService);
        expect(result.shoppingCart.orders[0].wertgarantieProduct.price).toEqual(newWertgarantieProductPrice);
        expect(result.changes.updated).toEqual([{
            id: idToUpdate,
            wertgarantieProductPriceChanged: true
        }]);
    }
);

test("should delete order item if no premium could be found for new shop item price", async () => {
        const updatedPriceWayOutOfReach = 2000000000;
        const shopShoppingCart = [
            {
                price: updatedPriceWayOutOfReach,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                name: "IPhone X"
            }
        ];

        const idToDelete = "18ff0413-bcfd-48f8-b003-04b57762067a";
        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: idToDelete,
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId",
                        name: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
            confirmations: {
                termsAndConditionsConfirmed: false
            }
        };
        const newWertgarantieProductPrice = undefined;
        const mockProductOffersService = {
            getPriceForSelectedProductOffer: () => newWertgarantieProductPrice,
            getProductOfferById: () => productOffersTestResponses.productOffersPhone.productOffers[0]
        };
        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart, undefined, mockProductOffersService);
        expect(result).toEqual({
            shoppingCart: {
                orders: [],
                confirmations: {
                    termsAndConditionsConfirmed: false
                }
            },
            changes: {
                updated: [],
                deleted: [idToDelete]
            }
        });
    }
);

test("should ignore changed device class on matching shopProduct", async () => {
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Completely different",
                orderItemId: "orderItemId",
                name: "IPhone X"
            }
        ];

        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: "18ff0413-bcfd-48f8-b003-04b57762067a",
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId",
                        name: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
        };

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(result.shoppingCart.orders[0].shopProduct.deviceClass).toEqual("Smartphone");
        expect(result.changes).toEqual(emptyChanges);
    }
);

test("should update name if matching shopProduct name differs", async () => {
        const updatedName = "IPhone X in Red";
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                name: updatedName
            }
        ];

        const idToUpdate = "18ff0413-bcfd-48f8-b003-04b57762067a";
        const wertgarantieShoppingCart = {
            orders: [
                {
                    id: idToUpdate,
                    shopProduct: {
                        price: 10000,
                        deviceClass: "Smartphone",
                        orderItemId: "orderItemId",
                        name: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
            confirmations: {
                termsAndConditionsConfirmed: false
            }
        };

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart, undefined, mockProductOfferServicePhone);
        expect(result.shoppingCart.orders[0].shopProduct.name).toEqual(updatedName);
        expect(result.changes.updated).toEqual([{
            id: idToUpdate,
            wertgarantieProductPriceChanged: false
        }]);
    }
);

test("should return given wertgarantieShopping Cart if it was empty", async () => {
    const shopShoppingCart = [
        {
            price: 20000,
            manufacturer: "Apple Inc",
            deviceClass: "Smartphone",
            orderItemId: "orderItemId",
            name: "IPhone X"
        }
    ];

    const wertgarantieShoppingCart = {
        orders: [],
    };

    const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
    expect(result.shoppingCart).toEqual(wertgarantieShoppingCart);
    expect(result.changes).toEqual(emptyChanges);
});

test("should add bike product to shopping cart with lock requirement", async () => {
    const productId = uuid();
    const productToAdd = {
        shopProduct: {
            price: 100000,
            deviceClass: 'Bike',
            name: 'Test Bike',
            orderItemId: 'some order item id'
        },
        wertgarantieProduct: {
            id: productId,
            name: "Komplettschutz Rad mit monatlicher Zahlweise",
            paymentInterval: "monthly",
            price: 2000
        }
    };

    const orderId = uuid();
    const shoppingCart = {
        orders: [
            {
                id: orderId,
                shopProduct: {
                    price: 100000,
                    deviceClass: "Bike",
                    orderItemId: "orderItemId",
                    name: "Test Bike",
                },
                wertgarantieProduct: {
                    id: productId,
                    name: "Komplettschutz Rad mit monatlicher Zahlweise",
                    price: 500,
                    shopProductCondition: "NEW",
                    paymentInterval: "monthly"
                }
            },
        ],
        confirmations: {
            termsAndConditionsConfirmed: false
        }
    };
    const newOrderId = uuid();
    const addResult = await service.addProductToShoppingCart(shoppingCart, productToAdd, clientConfig, newOrderId, mockProductOfferServiceBike);
    expect(addResult.shoppingCart).toEqual({
        "orders": [
            {
                "id": orderId,
                "shopProduct": {
                    "price": 100000,
                    "deviceClass": "Bike",
                    "orderItemId": "orderItemId",
                    "name": "Test Bike"
                },
                "wertgarantieProduct": {
                    "id": productId,
                    "name": "Komplettschutz Rad mit monatlicher Zahlweise",
                    "price": 500,
                    "paymentInterval": "monthly",
                    "shopProductCondition": "NEW"
                }
            },
            {
                "id": newOrderId,
                "shopProduct": {
                    "price": 100000,
                    "deviceClass": "Bike",
                    "name": "Test Bike",
                    "orderItemId": "some order item id"
                },
                "wertgarantieProduct": {
                    "id": productId,
                    "name": "Komplettschutz Rad mit monatlicher Zahlweise",
                    "paymentInterval": "monthly",
                    "shopProductCondition": "NEW",
                    "price": 2000
                }
            }
        ],
        "confirmations": {
            "termsAndConditionsConfirmed": false,
            "lockConfirmed": false,
            "requiredLockPrice": 1900
        }
    });
});

test("should update lock price if more expensive lock is required", async () => {
    const currentShoppingCart = {
        "orders": [
            {
                "id": "6ee8d758-dc30-490d-beaf-f0c9025faa8d",
                "shopProduct": {
                    "price": 100000,
                    "deviceClass": "Bike",
                    "name": "Test Bike",
                    "orderItemId": "some order item id"
                },
                "wertgarantieProduct": {
                    "id": "6ecfd88b-a342-4f93-b662-1d633c683cef",
                    "name": "Komplettschutz Rad mit monatlicher Zahlweise",
                    "paymentInterval": "monthly",
                    "price": 2000
                }
            }
        ],
        "confirmations": {
            "termsAndConditionsConfirmed": false,
            "lockConfirmed": false,
            "requiredLockPrice": 1900
        }
    };

    const productToAdd = {
        shopProduct: {
            price: 100001, // should get lock price 4900
            deviceClass: 'Bike',
            name: 'Test Bike',
            orderItemId: 'some order item id'
        },
        wertgarantieProduct: {
            id: uuid(),
            name: "Komplettschutz Rad mit monatlicher Zahlweise",
            paymentInterval: "monthly",
            price: 2000
        }
    };

    const addResult = await service.addProductToShoppingCart(currentShoppingCart, productToAdd, clientConfig, undefined, mockProductOfferServiceBike);
    expect(addResult.shoppingCart.confirmations).toEqual({
        "termsAndConditionsConfirmed": false,
        "lockConfirmed": false,
        "requiredLockPrice": 4900
    })
});

test("should update lock price if product is deleted from shopping cart and cheaper bike remains", async () => {
    const orderIdToDelete = uuid();
    const productId = uuid();
    const currentShoppingCart = {
        "orders": [
            {
                "id": "8369e0af-284c-43fc-bd9d-55e116996721",
                "shopProduct": {
                    "price": 100000,
                    "deviceClass": "Bike",
                    "orderItemId": "orderItemId",
                    "name": "Test Bike"
                },
                "wertgarantieProduct": {
                    "id": productId,
                    "name": "Komplettschutz Rad mit monatlicher Zahlweise",
                    "price": 500,
                    "paymentInterval": "monthly"
                }
            },
            {
                "id": orderIdToDelete,
                "shopProduct": {
                    "price": 100001,
                    "deviceClass": "Bike",
                    "name": "Test Bike",
                    "orderItemId": "some order item id"
                },
                "wertgarantieProduct": {
                    "id": productId,
                    "name": "Komplettschutz Rad mit monatlicher Zahlweise",
                    "paymentInterval": "monthly",
                    "price": 2000
                }
            }
        ],
        "confirmations": {
            "termsAndConditionsConfirmed": false,
            "lockConfirmed": false,
            "requiredLockPrice": 4900
        }
    };

    const result = await service.removeProductFromShoppingCart(orderIdToDelete, currentShoppingCart, "testClient", mockProductOfferServiceBike);
    expect(result.orders.length).toEqual(1);
    expect(result.confirmations.requiredLockPrice).toEqual(1900);
});

test('should return undefined for missing wertgarantie shopping cart', async () => {
    const result = await service.checkoutShoppingCart([], {}, undefined, undefined, {});
    expect(result).toBe(undefined);
});


test('correct device classes could handle empty string as device class', () => {
    const shopProduct = {
        orderId: "3000000041",
        price: 1000,
        orderItemId: "207493",
        name: "Gutschein",
        deviceClass: "",
        manufacturer: "Store"
    }
    service.correctDeviceClasses([shopProduct]);

    expect(shopProduct.deviceClasses).toEqual([]);
    expect(shopProduct.deviceClass).toEqual(undefined);
})

test('correct device classes could prefer given deviceClasses values', () => {
    const shopProduct = {
        orderId: "3000000041",
        price: 1000,
        orderItemId: "207493",
        name: "Gutschein",
        deviceClass: "test",
        deviceClasses: "class1,class2",
        manufacturer: "Store"
    }
    service.correctDeviceClasses([shopProduct]);

    expect(shopProduct.deviceClasses).toEqual(["class1", "class2"]);
    expect(shopProduct.deviceClass).toEqual(undefined);
})

test('correct device classes could set deviceClass value if devicesClasses is not filled', () => {
    const shopProduct = {
        orderId: "3000000041",
        price: 1000,
        orderItemId: "207493",
        name: "Gutschein",
        deviceClass: "test",
        deviceClasses: "",
        manufacturer: "Store"
    }
    service.correctDeviceClasses([shopProduct]);

    expect(shopProduct.deviceClasses).toEqual(["test"]);
    expect(shopProduct.deviceClass).toEqual(undefined);
})
