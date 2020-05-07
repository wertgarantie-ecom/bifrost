const Mailgun = require('mailgun-js');
const renderCustomerMailHtml = require('./customerMailHtml');

const _mailgunOptions = process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production' ? {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
} : {
    apiKey: "dummyApiKey",
    domain: "dummyDomain",
    testMode: true,
    testModeLogger: (httpOptions, payload) => {
        console.log('Mail send with payload:' + payload)
    }
}

module.exports.sendCustomerCheckoutMail = async function sendCustomerCheckoutMail(customerMailAddress, contractNumber, mailgunOptions = _mailgunOptions) {
    const mailgun = Mailgun(mailgunOptions);
    var data = {
        from: 'ecommerce.wertgarantie.com <me@samples.mailgun.org>',
        to: customerMailAddress,
        subject: `Vielen Dank für Ihren Auftrag ${contractNumber}`,
        html: renderCustomerMailHtml(contractNumber)
    };
    try {
        return await mailgun.messages().send(data);
    } catch (e) {
        console.error(e);
    }
}