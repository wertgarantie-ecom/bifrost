// language=CSS
exports.componentTextEditorStyling = `
    .component-section {
        display: flex;
        flex-flow: column;
        width: 100%;
    }

    .editor__row {
        display: flex;
    }

    .attribute {
        margin: 0.5em 0;
        font-weight: bold;
    }
    
    .edit-row__item--small {
        width: 10%;
    }

    .edit-row__item--large {
        width: 45%;
    }

    .row__item--header {
        font-size: 1.3em;
        font-weight: bold;
    }

    .input__row {
        display: flex;
        padding: 0.5em 0;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.57);
    }

    .input__edit {
        display: flex;
        justify-content: space-between;
        width: 90%;
    }

    .input__delete {
        width: 10%;
        margin-left: 2em;
    }

    textarea {
        width: 90%;
        height: 60px;
    }
`;