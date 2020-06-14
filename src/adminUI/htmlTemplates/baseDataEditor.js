exports.getEditor = function getEditor(client) {
    // language=HTML
    return `
        <div class="base__title">Basis-Konfiguration</div>
        <div class="attributes">
            ${Object.keys(client).map(key => key !== 'id' ? `
                <div class="edit-section">
                    <form ${isJson(client[key]) ? 'class="json-expected"' : ''} action="${'/admin/' + client.id + '/base'}" method="post">
                        <input type="hidden" name="attribute" value="${key}">
                        <div class="attribute">
                            ${key}
                        </div>
                        <div class="edit-section__editor">
                            <div class="value-editor__field">
                                <textarea class="input-textarea" name="value" placeholder="Hier den neuen Wert der Config eingeben">${isJson(client[key]) ? JSON.stringify(client[key], null, 2) : client[key]}</textarea>
                            </div>
                            <div class="value-editor__field value-editor__field--current">
                                ${isJson(client[key]) ? `<pre><code>${JSON.stringify(client[key], null, 4)}</code></pre>` : client[key]}
                            </div>
                            <div class="editor-submit">
                                <button type="submit" class="submit-button">Speichern</button>
                            </div>
                        </div>
                    </form>
                </div>
                <hr>
            ` : ``).join('')}
        </div>
        <script>
            const jsonInputForms = document.getElementsByClassName('json-expected');
            for (var i = 0; i < jsonInputForms.length; i++) {
                const jsonInputForm = jsonInputForms[i];
                jsonInputForm.addEventListener('submit', (e) => {
                    try {
                        JSON.parse(jsonInputForm.querySelector('.input-textarea').value);
                        return true;
                    } catch {
                        alert(jsonInputForm.querySelector('.attribute').textContent + " has not been filled with a json value");
                        jsonInputForm.querySelector('.input-textarea').classList.add('input-textarea--warning')
                    }
                })
            }
        </script>
    `;
};

function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}