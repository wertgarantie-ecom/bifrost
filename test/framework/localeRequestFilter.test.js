const filter = require('../../src/framework/localeRequestFilter').default;


test('should replace unsupported language with de', () => {
    const req = {
        locale: {
            language: "en"
        }
    }
    filter(req, undefined, next => next);

    expect(req.locale.language).toEqual('de');
});

test('should use default locale if none is provided', () => {
    const req = {};
    filter(req, undefined, next => next);

    expect(req.locale.language).toEqual('de');
});
