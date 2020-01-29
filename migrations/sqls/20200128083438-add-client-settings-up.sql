CREATE TABLE IF NOT EXISTS Client
(
    id   uuid PRIMARY KEY,
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS ClientSecret
(
    secret   text PRIMARY KEY,
    clientId uuid NOT NULL,
	UNIQUE(secret, clientId),
    CONSTRAINT client_id FOREIGN KEY (clientId) REFERENCES client (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ClientPublicId
(
    publicId uuid PRIMARY KEY,
    clientId uuid NOT NULL,
	UNIQUE(publicId, clientId),
    CONSTRAINT client_id FOREIGN KEY (clientId) REFERENCES client (id) ON DELETE CASCADE
);