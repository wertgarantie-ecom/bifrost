// language=CSS
const styling = `
    body {
        font-family: Arial, Helvetica, sans-serif;
        width: 100%;
    }

    a {
        text-decoration: none;
        color: #41a4ff;
    }

    .navbar {
        background-color: #323232;
        color: #c8c8c8;
        display: flex;
        height: 3em;
        width: 100%;
        padding: 0 10%;
        align-items: center;
    }

    .navbar__link {
        color: #c8c8c8;
    }

    .content {
        padding: 0 20%;
    }

    .config-navbar {
        display: flex;
    }

    .configuration-section {
        background-color: #c6c6c6;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3em;
        padding: 1em 2em;
    }

    .configuration-section--selected {
        background-color: #323232;
        color: #c8c8c8;
    }

    .configuration-link {
        background-color: #c6c6c6;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3em;
        padding: 1em 2em;
    }

    .language-link {
        background-color: #c6c6c6;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2em;
        padding: 1em 2em;
    }

    .configuration-section--selected, .language-link--selected {
        background-color: #323232;
    }

    .language-menu {
        display: flex;
        margin: 2em;
    }

    .component-details {
        margin: 1em 0;
    }
    
    .submit-button {
        padding: 0.5em;
        background-color: #41a4ff;
        font-size: 0.8em;
        font-weight: 700;
        color: #e9e9e9;
        border-radius: 10px;
    }

    .submit-button--delete {
        background-color: #ff0020;
    }
`;


exports.htmlTemplate = function htmlTemplate(title, additionalStyling = [], body) {
    // lanugage=HTML
    return `
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <style>
        ${styling}
    </style>
    ${additionalStyling.map(style => `
        <style>
            ${style}
        </style>`
    )}
    <title>${title}</title>
</head>
<body>
    <div class="navbar">
        <a class="navbar__link" href="${process.env.BASE_URI + '/admin'}">Alle Clients</a>
    </div>
    <div class="content">
        ${body}
    </div>
</body>
</html>`;
};

exports.clientConfigurationNavbar = function clientConfigurationNavbar(highlightedSection, clientId) {
    // language=HTML
    return `<div class="config-navbar">
        <div class="configuration-section${highlightedSection === 'base' ? ' configuration-section--selected' : ''}">
            <a href="${process.env.BASE_URI + '/admin/' + clientId}">Basis-Daten</a>
        </div>
        <div class="configuration-section${highlightedSection === 'component-texts' ? ' configuration-section--selected' : ''}">
            <a href="${process.env.BASE_URI + '/admin/' + clientId + '/component-texts'}">Komponenten-Texte</a>
        </div>
        <div class="configuration-section${highlightedSection === 'backend-config' ? ' configuration-section--selected' : ''}">
            <a href="${process.env.BASE_URI + '/admin/' + clientId + '/backend-config'}">Backend-Konfiguration</a>
        </div>
    </div>`
}

