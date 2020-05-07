const Mailgun = require('mailgun-js');
const renderCustomerMailHtml = require('./customerMailHtml');
const renderShopReportMailHtml = require('./shopReportMailHtml');

module.exports.sendCheckoutMails = function (shopName, shopEmail, purchases, customer) {
    purchases.forEach(purchase => {
        if (purchase.success) {
            sendReportMailToShop(shopName, shopEmail, purchase, customer);
            sendCheckoutMailToCustomer(customer.email, purchase.contractNumber);
        }
    })
};

async function sendCheckoutMailToCustomer(customerMailAddress, contractNumber, mailgunOptions = _mailgunOptions) {
    const subject = `Vielen Dank für Ihren Auftrag ${contractNumber}`;
    const body = renderCustomerMailHtml(contractNumber);
    return await sendMail(customerMailAddress, subject, body, mailgunOptions);
}

async function sendReportMailToShop(shopName, shopMailAddress, purchase, customer, mailgunOptions = _mailgunOptions) {
    if (!shopMailAddress) {
        return;
    }
    const subject = `Wertgarantie Versicherungsantrag ${purchase.contractNumber} erstellt ${purchase.orderId ? "für Order" + purchase.orderId : "für Produkt " + purchase.shopProduct}`;
    const body = renderShopReportMailHtml(shopName, purchase, subject, customer);
    return await sendMail(shopMailAddress, subject, body, mailgunOptions);
}

async function sendMail(to, subject, body, mailgunOptions) {
    const mailgun = Mailgun(mailgunOptions);
    const data = {
        from: 'ecommerce.wertgarantie.com <me@samples.mailgun.org>',
        to: to,
        subject: subject,
        html: body
    };
    return await mailgun.messages().send(data);
}

const testOptions = {
    apiKey: "dummyApiKey",
    domain: "dummyDomain",
    testMode: true,
    testModeLogger: (httpOptions, payload) => {
        console.log('Mail send with payload:' + payload)
    }
}

const prodOptions = {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
}

function isMailEnabled() {
    return process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production';
}

const _mailgunOptions = isMailEnabled() ? prodOptions : testOptions;

module.exports.sendCheckoutMailToCustomer = sendCheckoutMailToCustomer;
module.exports.sendReportMailToShop = sendReportMailToShop;
