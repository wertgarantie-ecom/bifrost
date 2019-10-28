var uuid = require('uuid');

exports.addProductToShoppingCart = function addProductToShoppingCart(req, res) {
    var shoppingCart = req.signedCookies.shoppingCart;
    console.log(shoppingCart);
    // falls keine shopping cart ID vorhanden
    if (!shoppingCart) {
        console.log("no session ID");
        // generate new shopping cart
        shoppingCart = {};
        shoppingCart.cart_id = uuid();
        shoppingCart.products = [];
    }
    // füge neue Produkte hinzu
    console.log(shoppingCart);
    addProduct(shoppingCart, req);
    res.cookie("shoppingCart", shoppingCart, { signed: true });

    // redirect?
    res.send(shoppingCart.cart_id);
}


exports.showShoppingCart = function showShoppingCart(req, res) {
    console.log(req.signedCookies.shoppingCart);
    res.send(req.signedCookies.shoppingCart);
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

