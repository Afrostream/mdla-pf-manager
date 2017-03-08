-- Table: "PFProviders"

-- DROP TABLE "PFProviders";

CREATE TABLE "PFProviders"
(
_id serial NOT NULL,
  "name" character varying(30),
  "data" json,
   CONSTRAINT "PFProviders_pkey" PRIMARY KEY (_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "PFProviders"
  OWNER TO postgres;
