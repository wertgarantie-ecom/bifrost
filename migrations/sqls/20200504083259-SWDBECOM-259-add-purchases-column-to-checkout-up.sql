ALTER TABLE checkout
ADD COLUMN purchases jsonb;

DROP TABLE purchase;