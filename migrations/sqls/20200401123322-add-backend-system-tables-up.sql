ALTER Table ClientPublicId ALTER Column publicId Type text;
ALTER TABLE Client ADD COLUMN heimdallClientId UUID;
ALTER TABLE Client ADD COLUMN webservicesUsername text;
ALTER TABLE Client ADD COLUMN webservicesPassword text;
ALTER TABLE Client ADD COLUMN activepartnernumber int not null;