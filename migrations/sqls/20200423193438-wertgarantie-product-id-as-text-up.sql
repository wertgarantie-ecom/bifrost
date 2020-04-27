alter table purchase alter column wertgarantieproductid type text;
alter table purchase rename column deviceclass to wertgarantiedeviceclass;
alter table purchase alter column wertgarantiedeviceclass type text;
alter table purchase rename column deviceprice to shopdeviceprice;
alter table purchase rename column shopproduct to shopdevicemodel;
alter table purchase add column shopdeviceclass text;
alter table purchase add column backend text;
alter table purchase add column resultcode text;
alter table purchase alter column transactionnumber type text;
