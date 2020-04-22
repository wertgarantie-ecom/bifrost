const selectionPopupController = require('../../../src/components/selectionpopup/selectionPopUpController');
const productSelectionPopUpComponentService = {
    prepareProductSelectionData: () => {
        return {
            valid: false,
            errors: ['Hier gibt es nichts zu sehen']
        }
    }
};



test("Should return 500 if product offers are invalid", async () => {
    const req = {
        query: {
            deviceClass: 'xyz',
            devicePrice: 84000,
            clientId: 'clientId'
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
    const response = await selectionPopupController.getProducts(req, res, undefined, productSelectionPopUpComponentService);
    expect(response.statusCode).toBe(502);
    expect(response.body[0]).toEqual('Hier gibt es nichts zu sehen');
});