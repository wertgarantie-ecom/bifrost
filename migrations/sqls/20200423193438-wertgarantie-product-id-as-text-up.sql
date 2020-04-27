---------------------------+---------+-------------+
--| Column                  | Type    | Modifiers   |
--|-------------------------+---------+-------------|
--| id                      | uuid    |  not null   |
--| sessionid               | uuid    |  not null   |
--| wertgarantieproductid   | text    |  not null   |
--| deviceclass             | text    |  not null   |
--| deviceprice             | integer |  not null   |
--| success                 | boolean |  not null   |
--| message                 | text    |  not null   |
--| shopproduct             | text    |  not null   |
--| contractnumber          | integer |             |
--| transactionnumber       | integer |             |
--| activationcode          | text    |             |
--| wertgarantieproductname | text    |             |
--+-------------------------+---------+-------------+

--            id: purchase2Id,
--            wertgarantieProductId: "10",
--            wertgarantieProductName: "Premium",
--            wertgarantieDeviceClass: "9025",
--            success: true,
--            message: "it's awesome",
--            shopDevicePrice: 139999,
--            shopDeviceName: "iPhone X",
--            shopDeviceClass: "iPhone X",
--            contractNumber: 23479999,
--            transactionNumber: 7524546,
--            activationCode: "a447s7s6666g"

alter table purchase alter column wertgarantieproductid type text;
alter table purchase rename column deviceclass to wertgarantiedeviceclass;
alter table purchase alter column wertgarantiedeviceclass type text;
alter table purchase rename column deviceprice to shopdeviceprice;
alter table purchase rename column shopproduct to shopdevicemodel;
alter table purchase add column shopdeviceclass text;
alter table purchase add column backend text;
