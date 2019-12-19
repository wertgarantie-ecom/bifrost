const service = require('../../src/services/productImageService');

const productImageMappingWithTwoEntries = {
    "twoEntries": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/eBike-HP.jpeg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/utah-mountain-biking-bike-biking-71104.jpeg"
    ],
    "empty": []
};

test("should not get the same image when product count is lower or equal to the number of images available for device class", () => {
    const images = service.getRandomImageLinksForDeviceClass("twoEntries", 2, productImageMappingWithTwoEntries);
    const entries = productImageMappingWithTwoEntries.twoEntries;
    expect(images.sort()).toEqual(entries.sort());
});

test("should contain duplicate images when product count is higher than the number of images available for device class", () => {
    const images = service.getRandomImageLinksForDeviceClass("twoEntries", 4, productImageMappingWithTwoEntries);
    const entries = [...productImageMappingWithTwoEntries.twoEntries, ...productImageMappingWithTwoEntries.twoEntries];
    expect(images.sort()).toEqual(entries.sort());
});

test("should throw an error when unknown deviceClass is provided", () => {
    function getErrorForUnknownDeviceClass() {
        service.getRandomImageLinksForDeviceClass("FAIL", 4, productImageMappingWithTwoEntries);
    }

    expect(getErrorForUnknownDeviceClass)
        .toThrowError(/The given device class is unknown/);
});

test("should throw an error when no images are set for given device class", () => {
    function getErrorForDeviceClassWithoutImages() {
        service.getRandomImageLinksForDeviceClass("empty", 4, productImageMappingWithTwoEntries);
    }

    expect(getErrorForDeviceClassWithoutImages)
        .toThrowError(/There are no images for device class/);
});