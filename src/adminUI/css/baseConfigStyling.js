//language=CSS
exports.css = `
    .base__title {
        font-size: 1.5em;
        font-weight: bold;
        line-height: 2.5em;
    }

    .edit-section {
        display: flex;
        flex-flow: column;
    }

    .edit-section__editor {
        display: flex;
    }

    .value-editor__field {
        width: 45%;
        margin-right: 1em;
    }
    
    .value-editor__field--current {
        overflow: scroll;
        max-height: 400px;
    }
    
    .input-textarea {
        width: 100%;
        height: 150px;
    }
    
    .input-textarea--warning {
        border: 1px solid red;
    }
`;