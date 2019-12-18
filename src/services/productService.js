const axios = require('axios');
const heimdallUri = process.env.HEIMDALL_URI || "http://localhost:3001";

const productImageMapping = {
    // Smartphone
    "1dfd4549-9bdc-4285-9047-e5088272dade": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Premium.png"
    ],
    // Handy
    "2dc16d28-c7af-4e19-9494-1659e1c27201": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Premium.png"
    ],
    // Surfbox
    "41ade4ba-5f24-4321-b706-fa6d05d75a73": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Premium.png"
    ],
    // Tablets
    "bb3a615d-e92f-4d24-a4cc-22f8a87fc544": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Premium.png"
    ],
    // Datenstick
    "ebfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Premium.png"
    ],
    // Bike
    "6bdd2d93-45d0-49e1-8a0c-98eb80342222": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/eBike-HP.jpeg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/utah-mountain-biking-bike-biking-71104.jpeg"
    ]
};

exports.getRandomImageLinksForDeviceClass = function getRandomImageLinksForDeviceClass(deviceClass, productCount) {
    return this.getRandomImageLinkForDeviceClass(productImageMapping, deviceClass, productCount);
};

exports.getRandomImageLinkForDeviceClass = function getRandomImageLinkForDeviceClass(productImagesMap, deviceClass, productCount) {
    if (!productImagesMap[deviceClass]) {
        throw new Error("No images for device class '" + deviceClass + "' found. The given device class is unknown.");
    }
    let availableImages = [...productImagesMap[deviceClass]];
    if (availableImages.length === 0) {
        throw new Error("There are no images for device class '" + deviceClass + "' found. Contact component developers to set images or provide your own");
    }
    let selectedProductImages = [];

    while (selectedProductImages.length < productCount) {
        if (availableImages.length === 0) {
            availableImages = [...productImagesMap[deviceClass]];
        }
        let random = Math.floor(Math.random() * availableImages.length);
        selectedProductImages.push(availableImages.splice(random, 1)[0]);
    }

    return selectedProductImages;
};

exports.convertPayloadToProduct = function convertPayloadToProduct(payload, imageLink) {
    if (payload.payment === "Monat") {
        payload.payment = "monatl.";
    } else if (payload.payment === "Jahr") {
        payload.payment = "jährl.";
    } else {
        payload.payment = "pro " + payload.payment;
    }

    const advantages = payload.advantages.concat(payload.services);
    return {
        id: payload.id,
        name: payload.name,
        top_3: [],
        advantages: advantages,
        excludedAdvantages: [],
        infoSheetText: payload.documents[0].document_title,
        infoSheetUri: payload.documents[0].document_link,
        detailsDocText: payload.documents[1].document_title,
        detailsDocUri: payload.documents[1].document_link,
        paymentInterval: payload.payment,
        price: payload.price,
        currency: payload.price_currency,
        priceFormatted: payload.price_formatted,
        tax: payload.price_tax,
        taxFormatted: "(inkl. " + payload.price_tax + payload.price_currency + " VerSt**)",
        imageLink: imageLink
    }
};

exports.getProductOffers = async function getProductOffers(deviceClass, devicePrice) {
    let date = new Date();
    url = heimdallUri + "/api/v1/product-offers?device_class=" + deviceClass +
        "&device_purchase_price=" + devicePrice +
        "&device_purchase_date=" + date.toLocaleDateString();
    const options = {
        headers: {'Accept': 'application/json', "Authorization": "12345"}
    };
    const response = await axios.get(url, options);

    const products = [];
    const content = response.data;
    let imageLinks = [];
    imageLinks = this.getRandomImageLinksForDeviceClass(deviceClass, content.payload.length);
    content.payload.forEach((payload, idx) => {
        const product = this.convertPayloadToProduct(payload, imageLinks[idx]);
        products.push(product);
    });
    return products;
};



