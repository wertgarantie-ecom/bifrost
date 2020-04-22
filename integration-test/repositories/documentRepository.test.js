const repository = require('../../src/repositories/documentRepository');
const uuid = require('uuid');

describe("could retrieve persisted document", () => {
    const content = uuid() + "";
    const document = {
        type: "AVB",
        FILENAME: "my name",
        CONTENT: content
    };

    let id;

    test('should persist document', async () => {
        id = await repository.persist(document)
    });

    test('could retrieve document by id', async () => {
        const retrievedDocument = await repository.findById(id);
        expect(retrievedDocument).toEqual({
            id: id,
            content: content,
            name: "my name",
            type: "AVB"
        });
    })
});

