ALTER TABLE client ADD COLUMN backends jsonb;

ALTER TABLE client DROP COLUMN webservicesusername;
ALTER TABLE client DROP COLUMN webservicespassword;
ALTER TABLE client DROP COLUMN productOffersConfigurations;