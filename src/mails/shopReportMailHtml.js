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
    Nachname: ${purchase.lastname}<br>
    Straße: ${purchase.street}<br>
    Ort: ${purchase.city}<br>
    PLZ: ${purchase.zip}<br>
    Email: ${purchase.email}<br>
    </p>
     `
}
