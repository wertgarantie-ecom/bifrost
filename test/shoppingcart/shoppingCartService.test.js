const addProductToShoppingCartWithOrderId = require('../../src/shoppingcart/shoppingCartService').addProductToShoppingCart;
const service = require('../../src/shoppingcart/shoppingCartService');
const signatureService = require('../../src/shoppingcart/signatureService');
const ClientError = require('../../src/errors/ClientError');
const uuid = require('uuid');
const validCustomer = require('../../integration-test/helper/fixtureHelper').validCustomer;
const clientConfig = require('../../integration-test/helper/fixtureHelper').createDefaultClient();

const emptyChanges = {
    deleted: [],
    updated: []
}

function validProduct() {
    return {
        id: "9fd47b8a-f984-11e9-adcf-afabcc521083",
        shopProduct: {
            model: "Phone X",
            deviceClass: "Smartphone",
            price: 1200
        },
        wertgarantieProduct: {
            id: "1234",
            name: "Komplettschutz",
            paymentInterval: "monthly"
        }
    };
}

const includedOrder = {
    id: "5f507954-fed1-45c9-aaa6-30f216d6f163",
    shopProduct: {
        model: "Phone X",
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

test("should create and fill new shopping cart if no cart is given", () => {
    expect(addProductToShoppingCartWithOrderId(undefined, validProduct(), "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f", "9fd47b8a-f984-11e9-adcf-afabcc521083").orders).toEqual([validProduct()]);
});

test("new created shopping cart should have given clientId", () => {
    const publicClientId = "public:" + uuid();
    expect(addProductToShoppingCartWithOrderId(undefined, validProduct(), publicClientId, "9fd47b8a-f984-11e9-adcf-afabcc521083").publicClientId).toEqual(publicClientId);
});

test("should add product to existing shopping cart", () => {
    expect(addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f", "9fd47b8a-f984-11e9-adcf-afabcc521083").orders).toEqual([includedOrder, validProduct()]);
});


test("should allow duplicate products", () => {
    const publicClientId = "public:" + uuid();
    const validShoppingCart = {
        publicClientId: publicClientId,
        orders: [validProduct()],
        confirmations: {
            termsAndConditionsConfirmed: false
        }
    };
    expect(addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), publicClientId, "9fd47b8a-f984-11e9-adcf-afabcc521083").orders).toEqual([validProduct(), validProduct()]);
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

test("added product should always reject confirmation", () => {
    const shoppingCartWithAddedProduct = addProductToShoppingCartWithOrderId(validShoppingCart, validProduct(), "5209d6ea-1a6e-11ea-9f8d-778f0ad9137f", "9fd47b8a-f984-11e9-adcf-afabcc521083");
    expect(shoppingCartWithAddedProduct.confirmations.termsAndConditionsConfirmed).toEqual(false);
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
                    paymentInterval: "monthly"
                },
                shopProduct: {
                    price: "1000",
                    model: "IPhone X",
                    deviceClass: "Smartphone",
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
            deviceClass: "Smartphone",
            model: "IPhone X",
        }
    ];
    const customer = validCustomer();

    const mockClient = jest.fn(() => {
        throw new Error("you should never call me");
    });

    const result = await service.checkoutShoppingCart(purchasedProducts,
        customer,
        undefined,
        wertgarantieShoppingCart,
        clientConfig,
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
                "deviceClass": "Smartphone",
                "devicePrice": "1000",
                "success": false,
                "message": "couldn't find matching product in shop cart for wertgarantie product",
                "shopProduct": "IPhone X",
                "availableShopProducts": [
                    {
                        "price": "1200.93",
                        "manufacturer": "Apple Inc",
                        "deviceClass": "Smartphone",
                        "model": "IPhone X"
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
                    model: "Super Bike"
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
            model: "IPhone X",
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
                model: "IPhone X",
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
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        paymentInterval: "monthly",
                        price: 500
                    }
                },
            ],
        }

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(result.shoppingCart.orders).toEqual(wertgarantieShoppingCart.orders);
        expect(result.changes).toEqual(emptyChanges);
    }
)

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
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
        }

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(result.shoppingCart.orders).toEqual(wertgarantieShoppingCart.orders);
        expect(result.changes).toEqual(emptyChanges);
    }
)

test("should keep wertgarantieShoppingCart order if it matches with shopShoppingCart", async () => {
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                model: "IPhone X"
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
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
        }

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(result.shoppingCart.orders).toEqual(wertgarantieShoppingCart.orders);
        expect(result.changes).toEqual(emptyChanges);
    }
)

test("should remove wertgarantieShoppingCart order with orderItemId if no match in shoppingCart was found", async () => {
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "anotherOrderItemId",
                model: "IPhone X"
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
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
        }

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(result.shoppingCart.orders).toEqual([]);
        expect(result.changes.deleted).toEqual([idToDelete])
    }
)


test("should update wertgarantieShoppingCart order if price of matching shopShoppingCart item does not match", async () => {
        const updatedPrice = 20000;
        const shopShoppingCart = [
            {
                price: updatedPrice,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                model: "IPhone X"
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
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: wertgarantieProductPrice,
                        paymentInterval: "monthly"
                    }
                },
            ],
        }

        const mockProductOffersService = {
            getPriceForSelectedProductOffer: () => wertgarantieProductPrice
        }
        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart, undefined, mockProductOffersService);
        expect(result.shoppingCart.orders[0].shopProduct.price).toEqual(updatedPrice);
        expect(result.changes.updated).toEqual([{
            id: idToUpdate,
            wertgarantieProductPriceChanged: false
        }]);
    }
)

test("should update price of wertgarantie product if price of matching shopShoppingCart item does not match", async () => {
        const updatedPrice = 20000;
        const shopShoppingCart = [
            {
                price: updatedPrice,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                model: "IPhone X"
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
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
        }
        const newWertgarantieProductPrice = 1000000;
        const mockProductOffersService = {
            getPriceForSelectedProductOffer: () => newWertgarantieProductPrice
        }
        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart, undefined, mockProductOffersService);
        expect(result.shoppingCart.orders[0].wertgarantieProduct.price).toEqual(newWertgarantieProductPrice);
        expect(result.changes.updated).toEqual([{
            id: idToUpdate,
            wertgarantieProductPriceChanged: true
        }]);
    }
)

test("should delete order item if no premium could be found for new shop item price", async () => {
        const updatedPriceWayOutOfReach = 2000000000;
        const shopShoppingCart = [
            {
                price: updatedPriceWayOutOfReach,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                model: "IPhone X"
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
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
        }
        const newWertgarantieProductPrice = undefined;
        const mockProductOffersService = {
            getPriceForSelectedProductOffer: () => newWertgarantieProductPrice
        }
        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart, undefined, mockProductOffersService);
        expect(result).toEqual({
            shoppingCart: {
                orders: []
            },
            changes: {
                updated: [],
                deleted: [idToDelete]
            }
        });
    }
)

test("should ignore changed device class on matching shopProduct", async () => {
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Completely different",
                orderItemId: "orderItemId",
                model: "IPhone X"
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
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
        }

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(result.shoppingCart.orders[0].shopProduct.deviceClass).toEqual("Smartphone");
        expect(result.changes).toEqual(emptyChanges);
    }
)

test("should update model if matching shopProduct model differs", async () => {
        const updatedModel = "IPhone X in Red";
        const shopShoppingCart = [
            {
                price: 10000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                model: updatedModel
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
                        model: "IPhone X",
                    },
                    wertgarantieProduct: {
                        id: "9338a770-0d0d-4203-8d54-583a03bdebf3",
                        name: "Komplettschutz",
                        price: 500,
                        paymentInterval: "monthly"
                    }
                },
            ],
        }

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(result.shoppingCart.orders[0].shopProduct.model).toEqual(updatedModel);
        expect(result.changes.updated).toEqual([{
            id: idToUpdate,
            wertgarantieProductPriceChanged: false
        }]);
    }
)

test("should return given wertgarantieShopping Cart if it was empty", async () => {
        const shopShoppingCart = [
            {
                price: 20000,
                manufacturer: "Apple Inc",
                deviceClass: "Smartphone",
                orderItemId: "orderItemId",
                model: "IPhone X"
            }
        ];

        const wertgarantieShoppingCart = {
            orders: [],
        }

        const result = await service.syncShoppingCart(wertgarantieShoppingCart, shopShoppingCart);
        expect(result.shoppingCart).toEqual(wertgarantieShoppingCart);
        expect(result.changes).toEqual(emptyChanges);
    }
)

