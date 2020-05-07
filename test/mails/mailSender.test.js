const mailSender = require('../../src/mails/mailSender');

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
    await mailSender.sendCustomerCheckoutMail('myemail@mail.de', "45764565", testOptions);

    expect(!!emailBody).toEqual(true);
})