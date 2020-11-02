const repository = require('../../src/documents/documentRepository');
const uuid = require('uuid');

describe("could retrieve persisted document", () => {
    const content = uuid() + "";
    const document = {
        type: "AVB",
        name: "my name",
        content: content
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

describe("should have different hashes for different contents", () => {
    test("save 2 documents with different content", async () => {
        const content1 = uuid() + "";
        const document1 = {
            type: "AVB",
            name: "my name",
            content: content1
        };
        const id1 = await repository.persist(document1);

        const content2 = uuid() + "";
        const document2 = {
            type: "AVB",
            name: "my name",
            content: content2
        };
        const id2 = await repository.persist(document2);

        expect(id1).not.toEqual(id2);
    });
});

