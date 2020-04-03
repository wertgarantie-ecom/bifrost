ALTER Table ClientPublicId ALTER Column publicId Type text;
ALTER Table checkout ALTER Column clientid Type text;
ALTER TABLE Client ADD COLUMN heimdallClientId text;
ALTER TABLE Client ADD COLUMN webservicesUsername text;
ALTER TABLE Client ADD COLUMN webservicesPassword text;
ALTER TABLE Client ADD COLUMN activepartnernumber int not null;