CREATE TABLE IF NOT EXISTS Client
(
    id   uuid PRIMARY KEY,
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS ClientSecret
(
    secret   text PRIMARY KEY,
    clientId uuid NOT NULL,
    CONSTRAINT client_id FOREIGN KEY (clientId) REFERENCES client (id)
);

CREATE TABLE IF NOT EXISTS ClientPublicId
(
    publicId uuid PRIMARY KEY,
    clientId uuid NOT NULL,
    CONSTRAINT client_id FOREIGN KEY (clientId) REFERENCES client (id)
);