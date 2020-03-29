// const _clientService = require('./clientService');
const _tariffCalculatorService = require('./tariffCalculatorService');

exports.prepareLandingPageData = async function prepareLandingPageData(tariffCalculatorService = _tariffCalculatorService) {
    const tariffCalculatorHtml = await tariffCalculatorService.getTariffCalculatorHtml();

    return {
        textSections: {
            whyInsurance: whyInsurance,
            insuranceForDevices: insuranceForDevices,
            safeIsSafe: safeIsSafe,
            findYourTariff: findYourTariff
        },
        tariffCalculatorHtml: tariffCalculatorHtml
    }
};

const whyInsurance = {
    title: `Warum eine Elektroversicherung?`,
    text: `In unserem Alltag lauern viele Gefahren – auch für unsere Elektronikgeräte. Ehe man sich versieht fällt einem die teure Spiegelreflex-Kamera auf den Boden. Ein Schaden ist schnell geschehen, bestenfalls gibt es nur ein paar Schrammen, im schlimmsten Fall ist die Kamera defekt. In solch einer ärgerlichen Situation muss der Besitzer oftmals tief in die Tasche greifen, denn Stürze bei Elektrogeräten führen in den meisten Fällen zum Totalschaden, vor allem bei Kameras, Hörgeräten, Smartphones, Notebooks und weiteren Multimedia-Geräten. Auch bei Hörgeräten kann es mal passieren, dass der Besitzer diese verliert. Im Falle eines Verlustes oder Schadens ist eine Elektronikversicherung sehr hilfreich. WERTGARANTIE bietet Ihnen eine optimale Absicherung für praktisch alle mobilen und stationären Elektrogeräte.`
};

const insuranceForDevices = {
    title: `Die Versicherung für Ihre Haushaltsgeräte`,
    text: `Ob Kühlschrank, Rasenmäher, Gefriertruhe, Spül- oder Waschmaschine, die Geräte in der heutigen Zeit sind kaum noch wegzudenken. Haushaltsgeräte sind praktisch, sie sparen uns Zeit und erleichtern uns den Alltag. Haben Sie sich erst an den Luxus eines Haushaltsgerätes gewöhnt, ist es kaum noch weg zu denken. Mit der Zeit stellen sich leider bei vielen Geräten kleinere und oft größere Probleme ein. Besonders ärgerlich ist es, wenn die Waschmaschine den Geist aufgibt. Nicht in jedem Fall sind die Probleme mit nur wenigen Handgriffen selbst zu lösen. Daher ist es oft vorteilhaft eine Elektronikversicherung abgeschlossen zu haben.
            WERTGARANTIE ersetzt im Schadenfall anfallende Reparaturkosten – bei allen stationären und mobilen Elektronikgeräten mit einem Wert von bis zu 10.000 Euro, bei allen Smartphones mit einem Wert von bis zu 1.800 Euro.
            Haben Sie keine Angst mehr vor Schäden und hohen Reparaturkosten – auch bei unsachgemäßem Gebrauch und bis lange nach Ablauf der gesetzlichen Gewährleistung bieten wir Ihnen, schon ab 5 Euro pro Monat, eine optimale Absicherung für praktisch alle Elektrogeräte im Haushalt.`,
    imageLink: ``
};

const safeIsSafe = {
    title: `Sicher ist sicher - Diebstahlversicherung`,
    text: `Diebe werden erfinderischer. Sie nutzen immer wieder neue Methoden, um Beute zu machen. Egal ob Kameras, Notebooks, Fernseher, Smartphones oder Rasenmähroboter – Langfinger bedienen sich mithilfe einfallsreicher Tricks. Damit Sie sich in Zukunft vor Dieben schützen können, können Sie ganz einfach zum Komplettschutz der WERTGARANTIE den Diebstahlschutz dazu buchen. Wenn Sie nun eine unangenehme Begegnung mit einem Langfinger hatten, erhalten Sie eine Kostenbeteiligung für ein Ersatzgerät in Höhe des Gerätezeitwertes. Falls Sie sich für eine Elektronikversicherung mit einem Diebstahlschutz entschieden haben, sind Sie in allen Fällen auf der sicheren Seite – egal ob bei Diebstahl oder Elektronikschäden.`,
    imageLink: ``
};

const findYourTariff = {
    title: `Finden Sie Ihren passenden Tarif`,
    text: `Wählen Sie von den vier oben angebotenen Kategorien, „Mobile Telefone“, „Haushalt“, „Multimedia“ und „Hörgeräte“, Ihre Geräteklasse aus. Geben Sie Ihren Gerätetyp, den unsubventionierten Kaufpreis und das Kaufdatum an. Sie haben die Wahl einen Diebstahlschutz zu wählen. Berechnen Sie anschließend Ihren Tarif mit nur einem Klick. 
Überzeugen Sie sich von unseren Leistungen, freuen Sie sich auf günstige Beiträge, auf einen zuverlässigen Service und einen kompetenten Geräteschutz. Gehören Sie auch zu unseren zufriedenen Kunden.`
};