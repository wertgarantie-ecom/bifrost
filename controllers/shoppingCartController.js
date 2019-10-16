var postgres = require('../postgres/postgres');
var uuid = require('uuid');

var queryByCartId = {
    name: "find cart by id",
    text: "SELECT * FROM shopping_cart WHERE cart_id = $1"
}

var updateCart = {
    name: "update cart with id",
    text: "UPDATE shopping_cart SET cart = $2 WHERE cart_id = $1"
}

var insertCart = {
    name: "insert new shopping cart",
    text: "INSERT INTO shopping_cart VALUES ($1, $2)"
}

exports.addProductToShoppingCart = function addProductToShoppingCart(req, res) {
    var shoppingCartId = req.cookies.shoppingCartId;
    var shoppingCart = {};
    if (shoppingCartId) {
        queryByCartId.values = [shoppingCartId];

        postgres.query(queryByCartId, (err, res) => {
            if (err) {
                console.error(err);
            } else {
                console.log(res);
                const result = res.rows[0];
                if (!result) {
                    console.err("Unknown Shopping Cart ID submitted!");
                } else {
                    addProduct(result.cart, req);
                    updateCart.values = [shoppingCartId, JSON.stringify(result.cart)];
                    postgres.query(updateCart, (err, res) => {
                        if (err) {
                            console.err(err);
                        } else {
                            console.log("Updated Shopping Cart with ID: " + shoppingCartId);
                            console.log(res);
                        }
                    });
                }
            }
        });
    } else {
        // create new shopping cart
        shoppingCart.cart_id = uuid();
        res.cookie("shoppingCartId", shoppingCart.cart_id);
        // add products to shopping carts
        shoppingCart.products = [];
        addProduct(shoppingCart, req);
        shoppingCart.confirmation = false;

        insertCart.values = [shoppingCart.cart_id, JSON.stringify(shoppingCart)];
        postgres.query(insertCart, (err, res) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Inserted new Shopping Cart with ID: " + shoppingCart.cart_id);
                console.log(res);
            }
        });
    }
    res.send(shoppingCartId);
}


exports.shoppingCart = function showShoppingCarts(req, res) {
    
}

function addProduct(shoppingCart, req) {
    shoppingCart.products.push({
        product_id: req.body.product_id,
        device_class: req.body.device_class,
        device_purchase_price: req.body.device_purchase_price,
        device_purchase_currency: req.body.device_purchase_currency,
        date: Date.now
    });
}

