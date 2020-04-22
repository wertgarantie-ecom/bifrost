ALTER TABLE documents ADD PRIMARY KEY (id);

ALTER TABLE productoffers
DROP CONSTRAINT productoffers_pkey,
ADD CONSTRAINT productoffers_pkey PRIMARY KEY (clientid, hash);