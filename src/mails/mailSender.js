const Mailgun = require('mailgun-js');
const renderCustomerMailHtml = require('./customerMailHtml');
const renderShopReportMailHtml = require('./shopReportMailHtml');

module.exports.sendCheckoutMails = function (shopName, shopEmail, purchases, shopOrderId, customer, isTestCheckout) {
    purchases.forEach(purchase => {
        if (purchase.success) {
            sendReportMailToShop(shopName, shopEmail, purchase, shopOrderId, customer, isTestCheckout);
            sendCheckoutMailToCustomer(customer.email, purchase.contractNumber, isTestCheckout);
        }
    })
};

async function sendCheckoutMailToCustomer(customerMailAddress, contractNumber, isTestCheckout, mailgunOptions = _mailgunOptions) {
    const subject = `Vielen Dank für Ihren Auftrag ${contractNumber}`;
    const body = renderCustomerMailHtml(contractNumber);
    const to = isTestCheckout ? process.env.BIFROST_EMAIL_ADDRESS : customerMailAddress;
    return await sendMail(to, subject, body, mailgunOptions);
}

async function sendReportMailToShop(shopName, shopMailAddress, purchase, shopOrderId, customer, isTestCheckout, mailgunOptions = _mailgunOptions) {
    if (!shopMailAddress) {
        return;
    }
    const subject = `Wertgarantie Versicherungsantrag ${purchase.contractNumber} erstellt ${shopOrderId ? "für Order " + shopOrderId : "für Produkt " + purchase.shopProduct}`;
    const body = renderShopReportMailHtml(shopName, purchase, shopOrderId, subject, customer);
    const to = isTestCheckout ? process.env.BIFROST_EMAIL_ADDRESS : shopMailAddress;
    return await sendMail(to, subject, body, mailgunOptions);
}

async function sendMail(to, subject, body, mailgunOptions) {
    const mailgun = Mailgun(mailgunOptions);
    const data = {
        from: 'e-insurance.wertgarantie.com <no-reply@e-insurance.wertgarantie.com>',
        to: to,
        subject: subject,
        html: body
    };

    await mailgun.messages().send(data);
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
    domain: process.env.MAILGUN_DOMAIN,
    host: process.env.MAILGUN_HOST
}

function isMailEnabled() {
    return process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production';
}

const _mailgunOptions = isMailEnabled() ? prodOptions : testOptions;

module.exports.sendCheckoutMailToCustomer = sendCheckoutMailToCustomer;
module.exports.sendReportMailToShop = sendReportMailToShop;
