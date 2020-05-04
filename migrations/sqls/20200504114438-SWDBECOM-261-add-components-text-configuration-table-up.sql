CREATE TABLE IF NOT EXISTS client_component_texts (
    clientId uuid PRIMARY KEY,
    rating jsonb,
    landingPage jsonb,
    selectionPopup jsonb,
    confirmation jsonb,
    aftersales jsonb,
    FOREIGN KEY (clientId) REFERENCES client (id)
);