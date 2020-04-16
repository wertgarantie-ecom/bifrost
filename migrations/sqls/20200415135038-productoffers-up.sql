ALTER TABLE client ADD COLUMN productoffersconfigurations jsonb;

CREATE TABLE IF NOT EXISTS productOffers (
    id text PRIMARY KEY,
    clientId uuid REFERENCES client (id),
    productOffers jsonb,
);