module.exports = function renderCustomerMailHtml(contractNumber) {
    return `<p>Lieber Kunde, <br>
        schön, dass Sie sich für die Versicherung der WERTGARANTIE entschieden haben und Ihr Vertrauen neben 500.000 zufriedener
        Kunden in den Testsieger in Sachen Sicherheit, Service und Zufriedenheit setzen.</p>
        
        <p>Wir informieren Sie erneut per E-Mail, sobald wir Ihren Auftrag ${contractNumber} bearbeitet haben und gratulieren zu Ihrer
        Entscheidung. <br>
        Ihr Versicherungsschutz gilt ab dem Ersten des kommenden Monats.</p>
        
        <p>Herzlichst, <br>
        Ihr digitalpersönlicher Auftragsservice</p>
        <br>
        <br>
        <br>
        <br>
        Diese E-Mail wurde verschickt von:
        <br>
        <br>
        WERTGARANTIE AG <br>
        Breite Straße 8, 30159 Hannover
        <br>
        <br>
        Telefon: +49 (0)511 71280-123 <br>
        E-Mail: <a href="mailto:kunde@wertgarantie.com">kunde@wertgarantie.com</a> <br>
        Internet: <a href="https://www.wertgarantie.com">www.wertgarantie.com</a> <br>
        <br>
        <br>
        Bitte beachten Sie: <br>
        Dies ist eine automatisch versendete Nachricht. Bitte antworten Sie nicht auf dieses Schreiben, da die Adresse nur zur
        Versendung von E-Mails eingerichtet ist.
        <br>
        <br>
        <a href="https://www.wertgarantie.de/Home/Service/Impressum.aspx">Impressum</a> <br>
        <a href="https://www.wertgarantie.de/Home/Service/Datenschutz.aspx">Datenschutz</a><br>`
}