const selectionPopupController = require('../../../src/components/selectionpopup/selectionPopUpController');


test("Should return 502 if product offers are invalid", async () => {
    const productSelectionPopUpComponentService = {
        prepareProductSelectionData: () => {
            return {
                valid: false,
                errors: ['Hier gibt es nichts zu sehen']
            }
        }
    };

    const req = {
        query: {
            deviceClass: 'xyz',
            devicePrice: 84000,
            clientId: 'clientId'
        },
        locale: {
            language: 'de'
        }
    };
    const res = {
        status: (code) => {
            res.statusCode = code;
            return res;
        },
        send: (body) => {
            res.body = body;
            return res;
        }
    };
    const response = await selectionPopupController.getProducts(req, res, next => next, productSelectionPopUpComponentService);
    expect(response.statusCode).toBe(502);
    expect(response.body[0]).toEqual('Hier gibt es nichts zu sehen');
});