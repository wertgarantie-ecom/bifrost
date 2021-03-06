const request = require('supertest');
const app = require('../../src/app');
const documentRepository = require('../../src/documents/documentRepository');

describe("should get document when controller is called", () => {
    let id;
    test("save new document", async () => {
        id = await documentRepository.persist({
            name: "Testdokument.pdf",
            content: "JVBERi0xLjUNJcjIyMjIyMgNMSAwIG9iago8PC9DcmVhdGlvbkRhdGUoRDoyMDE4MTAxMDE1NDQzMCswMScwMCcpL0Ny",
            type: "LN"
        });
    });
    test("should return document", async () => {
        const result = await request(app)
            .get("/wertgarantie/documents/" + id);
        expect(result.status).toBe(200);
    });
});