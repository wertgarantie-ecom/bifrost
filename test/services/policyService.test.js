const service = require('../../src/services/policyService');
const productImageMappingWithTwoEntries = {
    "twoEntries": [
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/eBike-HP.jpeg",
        "https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/utah-mountain-biking-bike-biking-71104.jpeg"
    ],
    "empty": []
}

test("should not get the same image when product count is lower or equal to the number of images available for device class", () => {
    const images = service.getRandomImageLinkForDeviceClass(productImageMappingWithTwoEntries, "twoEntries", 2);
    const entries = productImageMappingWithTwoEntries.twoEntries;
    expect(images.sort()).toEqual(entries.sort());
});

test("should contain duplicate images when product count is higher than the number of images available for device class", () => {
    const images = service.getRandomImageLinkForDeviceClass(productImageMappingWithTwoEntries, "twoEntries", 4);
    const entries = [...productImageMappingWithTwoEntries.twoEntries, ...productImageMappingWithTwoEntries.twoEntries];
    expect(images.sort()).toEqual(entries.sort());
});

test("should throw an error when unknown deviceClass is provided", () => {
    function getErrorForUnknownDeviceClass() {
        service.getRandomImageLinkForDeviceClass(productImageMappingWithTwoEntries, "FAIL", 4);
    }
    expect(getErrorForUnknownDeviceClass)
        .toThrowError(/The given device class is unknown/);
});

test("should throw an error when no images are set for given device class", () => {
    function getErrorForDeviceClassWithoutImages() {
        service.getRandomImageLinkForDeviceClass(productImageMappingWithTwoEntries, "empty", 4);
    }
    expect(getErrorForDeviceClassWithoutImages)
        .toThrowError(/There are no images for device class/);
});