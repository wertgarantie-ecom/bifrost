alter table ClientPublicId alter Column publicId Type text;
alter table checkout alter Column clientid Type text;
alter table Client add COLUMN heimdallClientId text;
alter table Client add COLUMN webservicesUsername text;
alter table Client add COLUMN webservicesPassword text;
alter table Client add COLUMN activepartnernumber int;