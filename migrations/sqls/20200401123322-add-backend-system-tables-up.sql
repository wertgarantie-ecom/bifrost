/* Replace with your SQL commands */
ALTER TABLE Client ADD COLUMN HeimdallCliendId UUID;

CREATE TABLE IF NOT EXISTS Webservices(
    id uuid primary key,
    clientId uuid not null,
    username text not null,
    password text not null,
    akp int not null,
    CONSTRAINT client_id FOREIGN KEY (clientId) REFERENCES client (id) ON DELETE CASCADE
);

