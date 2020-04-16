ALTER TABLE client ADD COLUMN productoffersconfigurations jsonb;

CREATE TABLE IF NOT EXISTS productOffers (
	clientId uuid PRIMARY KEY REFERENCES client (id),
    hash text,
    productOffers jsonb
);