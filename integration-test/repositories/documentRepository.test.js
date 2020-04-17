const repository = require('../../src/repositories/documentRepository');

describe("could retrieve persisted document", () => {
    const document = {
        type: "AVB",
        name: "my name",
        content: "blob"
    };

    let id;

    test('should persist document', async () => {
        id = await repository.persist(document)
    });

    test('could retrieve document by id', async () => {

        const retrievedDocument = await repository.findById(id);
        expect(retrievedDocument).toEqual({
            ...document, id
        });
    })
});

