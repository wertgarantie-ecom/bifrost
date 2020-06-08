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


exports.generateHandbookForClient = function generateHandbookForClient(client) {
    if (!client.handbook) {
        return undefined;
    }
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
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/wertgarantie-integrations/src/${client.name}/wertgarantie-selection-pop-up.css">

    <wertgarantie-selection-pop-up id="wertgarantie-selection"
                                ${bifrostUriDateAttribute} 
                               data-shop-product-name="iPhone SE"
                               data-device-price=86000
                               data-device-class=${configuredDeviceClasses[0]}
                               ${client.handbook.features.includes('SHOPPING_CART_SYNC') ? 'data-order-item-id="1234-12309aj1-321"' : ''}
                               data-client-id="${client.publicClientIds[0]}">
    </wertgarantie-selection-pop-up>
    
    <script type="module" src="https://cdn.jsdelivr.net/npm/wertgarantie-selection-popup@2/dist/selection-popup.min.js" crossorigin="anonymous"></script>
\`\`\`

${client.handbook.components.selectionpopup.sample
        ? `Eine beispielhafte Integration kann hier gefunden werden: [pop-up-integration-sample](${client.handbook.components.selectionpopup.sample})`
        : ''}


Weitere Details zur Selection-PopUp-Component sind [hier](https://wertgarantie-ecom.github.io/bifrost-components/?path=/story/components-pop-up--product-selection-popup) zu finden.

### 2. Confirmation Component
${client.handbook.features.includes('SHOPPING_CART_SYNC')
        ? `
Die Confirmation Component benötigt zur Initialisierung den aktuellen Handyflash Shopping Cart (zumindest alle Artikel deren deviceClass versicherbar ist).
Die Artikel müssen in einem Base64 enkodierten JSON Array übergeben werden (das zugehörige Schema ist [hier](https://github.com/wertgarantie-ecom/bifrost/blob/master/src/shoppingcart/schemas/shopProductSchema.js) zu finden). 

Hier ein Beispiel Code in Javascript:

\`\`\`js
const confirmationCompData = [];
confirmationCompData.push(...shoppingCartData.products.map(product => {
    return {
        price: product.selectedVariant.devicePrice,
        deviceClass: product.deviceClass,
        name: product.productName,
        orderItemId: product.orderItemId
    }
}));
const confirmationShopOrderBase64 = Buffer.from(JSON.stringify(confirmationCompData)).toString('base64'); 
\`\`\`
        `
        : ''}

Die Confirmation Component ist designed, um im Warenkorb eingebunden zu werden. Im Warenkorb wird es ein HTMLElement geben, das den Einkauf der Shop-Produkte abschließt. 
Ein Selector dieses HTMLElements wird mit dem Attribut \`data-validation-trigger-selector\` der Komponente übergeben. Dahinter kann sich z. B. eine Form verbergen oder ein Button. Darauf setzt die Komponente automatisch einen Event-Listener auf den Event-Typ, der mit 
dem Attribut \`data-validation-trigger-event\` (form -> "submit", button -> "click", ...) übergeben wird. Beim entsprechenden Event führt die Komponente eine Prüfung durch, ob die Einverständniserklärung bestätigt wurde, bevor die eigentliche Aktion des Shops ausgeführt wird. 
Wurde nicht bestätigt, wird diese Aktion unterbrochen und die Komponente zeigt eine entsprechende Meldung an. Wurde bestätigt, wird der reguläre Vorgang im Shop ausgelöst.

\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/wertgarantie-integrations@0/src/${client.name}/wertgarantie-confirmation.css">
<wertgarantie-confirmation class="wertgarantie-confirmation" id="wg-confirmation"
      ${bifrostUriDateAttribute} 
       data-validation-trigger-selector="#orderbutton"
       data-validation-trigger-event="click"
       ${client.handbook.features.includes('SHOPPING_CART_SYNC') ? 'data-shop-order-base64="JVBERi0xLjYNJeLjz9MNCjI1IDAgb2JqDTw8L0xpbmVhcml6ZWQgMS9MIDgxNTAyL08..."' : ''}
       data-client-id="${client.publicClientIds[0]}">
</wertgarantie-confirmation>
                        
<script type="module" src="https://cdn.jsdelivr.net/npm/wertgarantie-confirmation@2/dist/confirmation.min.js" crossorigin="anonymous"></script>
\`\`\`

${client.handbook.components.confirmation.sample
        ? `Eine beispielhafte Integration kann hier gefunden werden: [confirmation-component-integration-sample](${client.handbook.components.confirmation.sample})`
        : ''}


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
                name: "Example Phone",
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
Weiterhin ist die public client ID erforderlich:

\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/wertgarantie-integrations@0/src/${client.name}/wertgarantie-after-sales.css ">

<wertgarantie-after-sales
                    ${bifrostUriDateAttribute} 
                    id="wertgarantie-after-sales"
                    data-shop-purchase-data="eyJwdXJjaGFzZWRQcm9kdWN0cyI6W3sicHJpY2UiOjg..."
                    data-client-id="${client.publicClientIds[0]}>
</wertgarantie-after-sales>

<script type="module" src="https://cdn.jsdelivr.net/npm/wertgarantie-after-sales@1/dist/after-sales.min.js" crossorigin="anonymous"></script>
\`\`\`

${client.handbook.components.aftersales.sample
        ? `Eine beispielhafte Integration kann hier gefunden werden: [after-sales-integration-sample](${client.handbook.components.aftersales.sample})`
        : ''}

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
<style>
	.markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}

	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}
</style>
    <div class="markdown-body">
        ${installationInstructionsMarkdown}
    </div>
</body>
</html>`;
}


;