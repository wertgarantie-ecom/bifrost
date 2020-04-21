ALTER TABLE productoffers
DROP CONSTRAINT productoffers_clientid_fkey,
ADD CONSTRAINT productoffers_clientid_fkey FOREIGN KEY (clientid) REFERENCES client(id) ON DELETE CASCADE;