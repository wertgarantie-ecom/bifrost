ALTER Table ClientPublicId ALTER Column publicId Type text;
ALTER TABLE Client ADD COLUMN heimdallClientId UUID;
ALTER TABLE Client ADD COLUMN webservicesUsername text not null;
ALTER TABLE Client ADD COLUMN webservicesPassword text not null;
ALTER TABLE Client ADD COLUMN activepartnernumber int not null;