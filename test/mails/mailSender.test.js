const mailSender = require('../../src/mails/mailSender');
const uuid = require('uuid');
const validCustomer = require('../../integration-test/helper/fixtureHelper').validCustomer;

test('should send customer mails without failures', async () => {
    let emailBody;
    const testOptions = {
        domain: "mydomain",
        apiKey: "myapiKey",
        testMode: true,
        testModeLogger: (httpOptions, payload) => {
            emailBody = payload;
        }
    }
    await mailSender.sendCheckoutMailToCustomer('myemail@mail.de', "45764565", testOptions);

    expect(!!emailBody).toEqual(true);
})

test('should send shop report mails without failures', async () => {
    let emailBody;
    const testOptions = {
        domain: "mydomain",
        apiKey: "myapiKey",
        testMode: true,
        testModeLogger: (httpOptions, payload) => {
            emailBody = payload;
        }
    }

    const purchase = {
        id: uuid(),
        orderId: uuid(),
        wertgarantieProductId: uuid(),
        wertgarantieProductName: "Komplettschutz Basis",
        deviceClass: "Smartphone",
        devicePrice: 120000,
        success: true,
        message: "successfully transmitted insurance proposal",
        shopProduct: "IPhone X",
        contractNumber: "45345464",
        transactionNumber: uuid(),
        backend: "webservices"
    }

    await mailSender.sendReportMailToShop('handyflash', 'arnelandwehr@gmail.com', purchase, validCustomer(), testOptions);

    expect(!!emailBody).toEqual(true);
})

