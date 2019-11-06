const productImageMapping = {
    // Smartphone
    "1dfd4549-9bdc-4285-9047-e5088272dade": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/eBike-HP.jpeg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/utah-mountain-biking-bike-biking-71104.jpeg"
    ],
    // Handy
    "2dc16d28-c7af-4e19-9494-1659e1c27201": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/eBike-HP.jpeg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/utah-mountain-biking-bike-biking-71104.jpeg"
    ],
    // Surfbox
    "41ade4ba-5f24-4321-b706-fa6d05d75a73": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/eBike-HP.jpeg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/utah-mountain-biking-bike-biking-71104.jpeg"
    ],
    // Tablets
    "bb3a615d-e92f-4d24-a4cc-22f8a87fc544": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/eBike-HP.jpeg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/utah-mountain-biking-bike-biking-71104.jpeg"
    ],
    // Datenstick
    "ebfb2d44-4ff8-4579-9cc0-0a3ccb8d6f2d": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/eBike-HP.jpeg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/utah-mountain-biking-bike-biking-71104.jpeg"
    ]
}


exports.getRandomImageLinkForDeviceClass = function getRandomImageLinkForDeviceClass(deviceClass, productCount) {
    let numberOfImages = productImageMapping[deviceClass].length;
    // resultSet
    let images = [];

    // already used image idices
    let usedImages = [];
    for (var i = 0; i < productCount; i++) {
        var random;
        do {
            random = Math.floor(Math.random() * numberOfImages);
        } while (usedImages.includes(random))

        if (productCount >= numberOfImages) {
            usedImages.push(random);
        }
        images.push(productImageMapping[deviceClass][random]);
    }

    return images;
}