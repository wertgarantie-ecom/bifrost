ALTER Table ClientPublicId ALTER Column publicId Type text;
ALTER TABLE Client ADD COLUMN heimdallClientId UUID;

CREATE TABLE IF NOT EXISTS Webservices(
    id uuid primary key,
    clientId uuid not null,
    username text not null,
    password text not null,
    activepartnernumber int not null,
    UNIQUE (clientId),
    CONSTRAINT client_id FOREIGN KEY (clientId) REFERENCES client (id) ON DELETE CASCADE
);

