const productImageMapping = {
    // Smartphone
    "1dfd4549-9bdc-4285-9047-e5088272dade": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test2.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test3.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test4.jpg"
    ],
    "Smartphone": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test2.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test3.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test4.jpg"
    ],
    "Smartphones": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test2.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test3.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test4.jpg"
    ],
    "460": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test2.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test3.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Smartphone/test4.jpg"
    ],
    // Handy
    "2dc16d28-c7af-4e19-9494-1659e1c27201": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/phone_displaybruch.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/waterdamage2.png"
    ],
    "Handy": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/phone_displaybruch.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/waterdamage2.png"
    ],
    // Surfbox
    "41ade4ba-5f24-4321-b706-fa6d05d75a73": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/phone_displaybruch.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/waterdamage2.png"
    ],
    "Surfbox": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/phone_displaybruch.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/waterdamage2.png"
    ],
    // Tablets
    "bb3a615d-e92f-4d24-a4cc-22f8a87fc544": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/phone_displaybruch.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/waterdamage2.png"
    ],
    "Tablets": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/phone_displaybruch.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/waterdamage2.png"
    ],
    // Datenstick
    "ebfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/phone_displaybruch.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/waterdamage2.png"
    ],
    "Datenstick": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/phone_displaybruch.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/waterdamage2.png"
    ],
    // Bike
    "6bdd2d93-45d0-49e1-8a0c-98eb80342222": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/eBike-HP.jpeg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/utah-mountain-biking-bike-biking-71104.jpeg"
    ],
    "Bike": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Bike/fahrrad_1.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Bike/fahrrad_2.jpg"
    ],
    "E-Bike": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/E-Bike/ebike_1.jpg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/E-Bike/ebike_2.jpg"
    ],
    // Test
    "fbfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
    ],
    "Test": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/Basis.png"
    ]
};

exports.getRandomImageLinksForDeviceClass = function getRandomImageLinksForDeviceClass(deviceClass, productCount, productImagesMap = productImageMapping) {
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