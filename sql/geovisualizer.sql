CREATE EXTENSION postgis;

CREATE TABLE IF NOT EXISTS poi
(
    id SERIAL NOT NULL,
    business_name CHARACTER VARYING(64) DEFAULT NULL::CHARACTER VARYING,
    address CHARACTER VARYING(165) DEFAULT NULL::CHARACTER VARYING,
    city character VARYING(45) DEFAULT NULL::character VARYING,
    state character VARYING(30) DEFAULT NULL::character VARYING,
    zip character VARYING(15) DEFAULT NULL::character VARYING,
    latitude double precision,
    longitude double precision,
    country character VARYING(2) DEFAULT 'US'::character VARYING NOT NULL,
    category_name CHARACTER VARYING(164) DEFAULT NULL::CHARACTER VARYING,
    category_id INTEGER
);


CREATE TABLE IF NOT EXISTS states
(
    id SERIAL NOT NULL,
    state CHARACTER VARYING(64) DEFAULT NULL::CHARACTER VARYING,
    country CHARACTER VARYING(165) DEFAULT NULL::CHARACTER VARYING,
    boundary public.geometry(Geometry,4326)
);
