CREATE TABLE IF NOT EXISTS client_component_texts (
    clientId uuid,
    locale text,
    rating jsonb,
    landingPage jsonb,
    selectionPopup jsonb,
    confirmation jsonb,
    aftersales jsonb,
    CONSTRAINT client_component_texts_pkey PRIMARY KEY (clientId, locale),
    FOREIGN KEY (clientId) REFERENCES client (id) ON DELETE CASCADE
);