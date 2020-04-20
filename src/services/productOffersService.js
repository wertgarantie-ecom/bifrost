const heimdallClient = require('./heimdallClient');

async function getProductOffers(clientConfig, deviceClass, price) {
    if (process.env.BACKEND === "webservices") {

    } else {
        const heimdallResponse = await heimdallClient.getProductOffers(clientConfig, deviceClass, price);
        return {
            generalDocuments: [],
            productOffers: heimdallProductOffersToGeneralProductOffers(heimdallResponse)
        };
    }
}

function heimdallProductOffersToGeneralProductOffers(heimdallClientResponse) {
    heimdallClientResponse.payload.map(heimdallOffer => {
        return [
            {
                id: heimdallOffer.id,
                name: heimdallOffer.name,
                advantages: [...heimdallOffer.advantages, ...heimdallOffer.services, ...heimdallOffer.special_advantages],
                prices: {
                    monthly: {
                        "price": heimdallOffer.prices.monthly.price,
                        "price_currency": heimdallOffer.prices.monthly.price_currency,
                        "price_tax": heimdallOffer.prices.monthly.price_tax
                    },
                    quarterly: {
                        "price": heimdallOffer.prices.quarterly.price,
                        "price_currency": heimdallOffer.prices.quarterly.price_currency,
                        "price_tax": heimdallOffer.prices.quarterly.price_tax
                    },
                    halfYearly: {
                        "price": heimdallOffer.prices.half_yearly.price,
                        "price_currency": heimdallOffer.prices.half_yearly.price_currency,
                        "price_tax": heimdallOffer.prices.half_yearly.price_tax
                    },
                    yearly: {
                        "price": heimdallOffer.prices.yearly.price,
                        "price_currency": heimdallOffer.prices.yearly.price_currency,
                        "price_tax": heimdallOffer.prices.yearly.price_tax
                    }
                },
                documents: heimdallOffer.documents.map(document => {
                    type: document.type,

                }
                    [
                        {
                            type: "type",
                            name: "name",
                            uri: "uri"
                        }
                    ]
                }
            },
        ]
    });

    {
        "document_title": "Rechtsdokumente",
        "document_file": "gu_wg_de_ks_0419_rechtsdokumente.pdf",
        "document_type": null,
        "document_link": "https://heimdall-stg-04.wertgarantie.com/download/82e38762-4440-46a9-a34e-58974a3ddad5"
    },
}