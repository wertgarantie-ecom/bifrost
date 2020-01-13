/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS checkout (
    sessionId UUID PRIMARY KEY,
    clientId UUID NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    traceId UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS purchase (
    purchaseId SERIAL PRIMARY KEY,
    sessionId UUID NOT NULL,
    wertgarantieProductId INTEGER NOT NULL,
    deviceClass UUID NOT NULL,
    devicePrice INTEGER NOT NULL,
    success BOOLEAN NOT NULL,
    message TEXT NOT NULL,
    shopProduct TEXT NOT NULL,
    contractNumber INTEGER,
    transactionNumber INTEGER,
    activationCode TEXT,
    CONSTRAINT checkout_sessionId FOREIGN KEY (sessionId) REFERENCES checkout (sessionId)
);