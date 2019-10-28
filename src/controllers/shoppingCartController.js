const service = require('../services/shoppingCartService');

/**
 * Add given product to existing or new shopping cart.
 */
// TODO add validation
exports.addProductToShoppingCart = function addProductToShoppingCart(req, res) {
    let shoppingCart = service.addProductToShoppingCart(req.signedCookies.shoppingCart, {
        product_id: req.body.product_id,
        device_class: req.body.device_class,
        device_purchase_price: req.body.device_purchase_price,
        device_purchase_currency: req.body.device_purchase_currency,
        date: Date.now
    });
    res.cookie("shoppingCart", shoppingCart, {signed: true});
    res.send(shoppingCart.cart_id);
};

/**
 * Display current shopping cart.
 */
exports.showShoppingCart = function showShoppingCart(req, res) {
    console.log(req.signedCookies.shoppingCart);
    res.send(req.signedCookies.shoppingCart);
};


function addProduct(shoppingCart, req) {
    shoppingCart.products.push({
    });
}

