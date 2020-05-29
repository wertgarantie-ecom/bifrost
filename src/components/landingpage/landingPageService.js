const metrics = require('../../framework/metrics')();
const component = require('../components').components.landingpage;


exports.showLandingPage = async function showLandingPage(clientConfig) {
    const result = {
        headImageLink: 'https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/Banner_clean.png',
        textSections: {
            whyInsurance: whyInsurance,
            insuranceForDevices: insuranceForDevices,
            safeIsSafe: safeIsSafe,
            findYourTariff: findYourTariff,
            bottom: bottom
        }
    }
    metrics.incrementShowComponentRequest(component.name, result, clientConfig.name);
    return result;
};

const whyInsurance = {
    title: `Text in voller Breite`,
    text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`
};

const insuranceForDevices = {
    title: `Text mit Bild rechts`,
    text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua ut labore et dolore magna aliquyam erat, sed diam voluptua ut labore et dolore magna aliquyam erat, sed diam voluptua.

Nvidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`,
    imageLink: `https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/brokenDisplay3.png`
};

const safeIsSafe = {
    title: `Text mit Bild Links`,
    text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua ut labore et dolore magna aliquyam erat, sed diam voluptua ut labore et dolore magna aliquyam erat, sed diam voluptua.

Nvidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`,
    imageLink: `https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/waterdamage2.png`
};

const findYourTariff = {
    title: `Hier soll mal der Tarifrechner hin`,
    text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua ut labore et dolore magna aliquyam erat, sed diam voluptua ut labore et dolore magna aliquyam erat, sed diam voluptua.`
};

const bottom = {
    title: `Finden Sie Ihren passenden Tarif`,
    text: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua ut labore et dolore magna aliquyam erat, sed diam voluptua ut labore et dolore magna aliquyam erat, sed diam voluptua.`,
    imageLink: 'https://wertgarantie-bifrost.s3.eu-central-1.amazonaws.com/landing-page/phone_selfie.jpg'
};

