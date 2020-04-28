ALTER TABLE purchase
ALTER COLUMN wertgarantieProductId TYPE text,
ALTER COLUMN contractNumber TYPE text,
ALTER COLUMN transactionNumber TYPE text,
ALTER COLUMN deviceClass TYPE text,
ADD COLUMN backend text;

ALTER TABLE purchase
RENAME activationCode TO backendResponseInfo;