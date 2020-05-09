module.exports = function renderCustomerMailHtml(shopName, purchase, subject, customer) {
    return `<p>${subject}</p>

    <p>
    <h3>${shopName}  Produkt:</h3>
    OrderId: ${purchase.orderId}<br>
    Modell: ${purchase.shopProduct}<br>
    DeviceClass: ${purchase.deviceClass}<br>
    Preis: ${purchase.devicePrice}<br>
    </p>
    
    <p>
    <h3>Wertgarantie  Versicherung:</h3>
    Produkt: ${purchase.wertgarantieProductName}<br>
    Id: ${purchase.wertgarantieProductId}<br>
    Vertragsnummer: ${purchase.contractNumber}<br>
    </p>
    
    <p>
    <h3>Kunde:</h3>
    Vorname: ${customer.firstname}<br>
    Nachname: ${customer.lastname}<br>
    Straße: ${customer.street}<br>
    Ort: ${customer.city}<br>
    PLZ: ${customer.zip}<br>
    Email: ${customer.email}<br>
    </p>
     `
}
