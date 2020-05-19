const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const _ = require('lodash');


exports.getInstallationInstructions = function getInstallationInstructions(client) {
    const configuredDeviceClassesArray = [];
    client.backends.webservices.productOffersConfigurations.map(offerConfig => {
       configuredDeviceClassesArray.push(...offerConfig.deviceClasses.map(deviceClass => deviceClass.objectCodeExternal));
    });
    const configuredDeviceClasses = _.uniqBy(configuredDeviceClassesArray, deviceClass => deviceClass);

    // language=md
    const installationInstructionsMarkdown =  md.render(`# Installationsanleitung für ${client.name} für Umgebung ${process.env.NODE_ENV}

## Konfiguration
* public Client Ids: \`${client.publicClientIds}\`
* secrets: \`${client.secrets}\`

## Konfigurierte Device Classes
${configuredDeviceClasses.map(deviceClass => `* ${deviceClass}`).join("\n")}

## Integration der Komponenten
1. Selection Pop Up Component
Initialisierung der Komponente mit Produktname, Preis (in minor Units -> Cents), konfigurierter DeviceClass und einer der public Client IDs:
\`\`\`html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/wertgarantie-integrations/src/handyflash/wertgarantie-selection-pop-up.css">

    <wertgarantie-selection-pop-up id="wertgarantie-selection"
                               ${process.env.NODE_ENV !== "production" ? `data-bifrost-uri="${process.env.BASE_URI}/wertgarantie"` : ``}
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

2. Confirmation Component

3. After Sales Component
`);

    // language=html
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
    
    <title>Installation Instructions for ${client.name}</title>
</head>
<body>
    <div class="markdown-body">
        ${installationInstructionsMarkdown}
    </div>
</body>
</html>`;
};