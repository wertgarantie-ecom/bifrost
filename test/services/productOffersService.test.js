const productOffersService = require('../../src/services/productOffersService');

test("test Heimdall product offer conversion", async () => {
    const brutto = 6000;
    console.log("tax: " + (Math.round(brutto - brutto / 1.19)));
});