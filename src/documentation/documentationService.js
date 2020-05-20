const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const md = new MarkdownIt(
    {
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (__) {
                }
            }

            return ''; // use external default escaping
        }
    }
);
const _ = require('lodash');


exports.getInstallationInstructions = function getInstallationInstructions(client) {
    const configuredDeviceClassesArray = [];
    client.backends.webservices.productOffersConfigurations.map(offerConfig => {
        configuredDeviceClassesArray.push(...offerConfig.deviceClasses.map(deviceClass => deviceClass.objectCodeExternal));
    });
    const configuredDeviceClasses = _.uniqBy(configuredDeviceClassesArray, deviceClass => deviceClass);
    const bifrostUriDateAttribute = `${process.env.NODE_ENV !== "production" ? `data-bifrost-uri="${process.env.BASE_URI}/wertgarantie"` : ``}`;
    // language=md
    const installationInstructionsMarkdown = md.render(`# Installationsanleitung für ${client.name} für Umgebung ${process.env.NODE_ENV}

## Konfiguration
* public Client Ids: \`${client.publicClientIds}\`
* secrets: \`${client.secrets}\`

## Konfigurierte Device Classes
${configuredDeviceClasses.map(deviceClass => `* ${deviceClass}`).join("\n")}

## Integration der Komponenten
### 1. Selection Pop Up Component

Initialisierung der Komponente mit Produktname, Preis (in minor Units -> Cents), konfigurierter DeviceClass und einer der public Client IDs:
\`\`\`html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/wertgarantie-integrations/src/handyflash/wertgarantie-selection-pop-up.css">

    <wertgarantie-selection-pop-up id="wertgarantie-selection"
                                ${bifrostUriDateAttribute} 
                               data-shop-product-name="iPhone SE"
                               data-device-price=86000
                               data-device-class="Smartphone"
                               data-order-item-id="1234-12309aj1-321"
                               data-client-id="${client.publicClientIds[0]}">
    </wertgarantie-selection-pop-up>
    
    <script type="module" src="https://cdn.jsdelivr.net/npm/wertgarantie-selection-popup@2/dist/selection-popup.min.js" crossorigin="anonymous"></script>
    
    <script>
        window.onload = function () {
        var selection = document.getElementById('wertgarantie-selection');
        if (selection) {
            selection.displayComponent();
        }
    }
    </script>
\`\`\`

Eine beispielhafte Integration kann hier gefunden werden: [pop-up-integration-sample](https://github.com/wertgarantie-ecom/integrations/blob/master/handyflash/warenkorb-staging.html)

Weitere Details zur Selection-PopUp-Component sind [hier](https://wertgarantie-ecom.github.io/bifrost-components/?path=/story/components-pop-up--product-selection-popup) zu finden.

### 2. Confirmation Component
Die Confirmation Komponente benötigt zur Initialisierung den aktuellen Handyflash Shopping Cart (zumindest alle Artikel deren deviceClass versicherbar ist).
Die Artikel müssen in einem Base64 enkodierten JSON Array übergeben werden (das zugehörige Schema ist [hier](https://github.com/wertgarantie-ecom/bifrost/blob/master/src/shoppingcart/schemas/shopProductSchema.js) zu finden). 

Hier ein Beispiel Code in Javascript:

\`\`\`js
const confirmationCompData = [];
confirmationCompData.push(...shoppingCartData.products.map(product => {
    return {
        price: product.selectedVariant.devicePrice,
        deviceClass: product.deviceClass,
        model: product.productName,
        orderItemId: product.orderItemId
    }
}));
const confirmationShopOrderBase64 = Buffer.from(JSON.stringify(confirmationCompData)).toString('base64'); 
\`\`\`

\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/wertgarantie-integrations@0/src/handyflash/wertgarantie-confirmation.css">
<wertgarantie-confirmation class="wertgarantie-confirmation" id="wg-confirmation"
      ${bifrostUriDateAttribute} 
       data-validation-trigger-selector="#orderbutton"
       data-validation-trigger-event="click"
       data-shop-order-base64="JVBERi0xLjYNJeLjz9MNCjI1IDAgb2JqDTw8L0xpbmVhcml6ZWQgMS9MIDgxNTAyL08...">
       data-client-id="${client.publicClientIds[0]}">
</wertgarantie-confirmation>
                        
<script type="module" src="https://cdn.jsdelivr.net/npm/wertgarantie-confirmation@2/dist/confirmation.min.js" crossorigin="anonymous"></script>
\`\`\`

Eine beispielhafte Integration kann hier gefunden werden: [confirmation-component-integration-sample](https://github.com/wertgarantie-ecom/integrations/blob/master/handyflash/warenkorb-staging.html)

Weitere Details zur Confirmation-Component sind [hier](https://wertgarantie-ecom.github.io/bifrost-components/?path=/story/components-confirmation--confirmation-component-phone-shop) zu finden.

### 3. After Sales Component
Die After-Sales Komponente benötigt zur Initialisierung ein Base64 enkodiertes JSON Object mit den Produkten, die bei ${client.name} gekauft wurden, sowie die Kundendaten und die mit einem secret verschlüsselte SessionID aus dem Cookie \`wertgaranite-session-id\`.
Das zugehörige Schema des JSON Objects ist [hier](https://github.com/wertgarantie-ecom/bifrost/blob/master/src/components/aftersales/afterSalesComponentCheckoutSchema.js) zu finden.

Hier ein Beispiel-Code in JavaScript:
\`\`\`js
const CryptoJS = require('crypto-js');

// retrieve cookie from request
const sessionId = req.cookies['wertgarantie-session-id'];

// encrypt retrieved sessionID with secret client ID provided by Wertgarantie team
const encryptedSessionId = CryptoJS.HmacSHA256(sessionId, "yourSecretClientIDFromWertgarantie").toString();

// Buffer stringified Object and convert to base64
const wertgarantieCheckoutDataBuffer = Buffer.from(JSON.stringify({
        purchasedProducts: [
            {
                price: 86000, // in minor units (cent)
                manufacturer: "XXXPhones Inc.",
                deviceClass: "Smartphone",
                model: "Example Phone",
                orderId: "orderNo1"
            }       
        ],
        customer: {
            salutation: 'Herr',
            firstname: 'Otto',
            lastname: 'Normalverbraucher',
            street: 'Beispielstraße 9',
            zip: '52345',
            city: 'Köln',
            country: 'Deutschland',
            email: 'otto@normalverbraucher.com'
        },
        encryptedSessionId: encryptedSessionId
    }));
const dataShopPurchaseData = wertgarantieCheckoutDataBuffer.toString('base64');
\`\`\`

Das Resultat (hier \`dataShopPurchaseData\`) wird mit dem HTML-Attribut \`data-shop-purchase-data\` der Komponente übergeben, die daraufhin die Versicherungsanträge übermittelt und das Ergebnis anzeigt.

\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/wertgarantie-integrations@0/src/handyflash/wertgarantie-after-sales.css ">

<wertgarantie-after-sales
                    ${bifrostUriDateAttribute} 
                    id="wertgarantie-after-sales"
                    data-shop-purchase-data="eyJwdXJjaGFzZWRQcm9kdWN0cyI6W3sicHJpY2UiOjg...">
</wertgarantie-after-sales>

<script type="module" src="https://cdn.jsdelivr.net/npm/wertgarantie-after-sales@1/dist/after-sales.min.js" crossorigin="anonymous"></script>
\`\`\`

Eine beispielhafte Integration kann hier gefunden werden: [after-sales-integration-sample](https://github.com/wertgarantie-ecom/integrations/blob/master/handyflash/bestellbestaetigungs_seite_staging.html)

Weitere Details zur Implementierung befinden sich [hier](https://wertgarantie-ecom.github.io/bifrost-components/?path=/story/components-after-sales--after-sales-general).

## Links
- [Dokumentation](https://wertgarantie-ecom.github.io/bifrost-components/?path=/story/about-about--overview)
- [Github Code](https://github.com/wertgarantie-ecom)
- [PopUp-Component Package](https://www.npmjs.com/package/wertgarantie-selection-popup)
- [Confirmation-Component Package](https://www.npmjs.com/package/wertgarantie-confirmation)
- [After-Sales-Component Package](https://www.npmjs.com/package/wertgarantie-after-sales)
- [PopUp-Component CDN](https://www.jsdelivr.com/package/npm/wertgarantie-selection-popup)
- [Confirmation-Component CDN](https://www.jsdelivr.com/package/npm/wertgarantie-confirmation)
- [After-Sales-Component CDN](https://www.jsdelivr.com/package/npm/wertgarantie-after-sales)
- [CSS Styles](https://www.jsdelivr.com/package/npm/wertgarantie-integrations?path=src)
`);
    // language=html
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
    <link rel="stylesheet"
      href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.0.0/build/styles/default.min.css">
    
    <title>Installation Instructions for ${client.name}</title>
</head>
<body>
    <div class="markdown-body">
        ${installationInstructionsMarkdown}
    </div>
</body>
</html>`;
}
;