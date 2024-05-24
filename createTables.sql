-- this creates tables for each dataset we chose from their csv files.
DROP TABLE IF EXISTS country_codes;
DROP TABLE IF EXISTS country_indicators;
DROP TABLE IF EXISTS pirate_attacks;

CREATE TABLE country_codes (
	country varchar(3),
	region varchar(50),
	country_name varchar(50)
);

CREATE TABLE country_indicators (
	country varchar(3),
	current_year int,
	corruption_index real,
	homicide_rate real,
	gdp real,
	fisheries_per_ton real,
	total_military real,
	population real,
	unemployment_rate real,
	total_gr real,
	gdp_industry real
);

CREATE TABLE pirate_attacks (
	date date,
	time varchar(10),
	longitude real,
	latitude real,
	attack_type varchar(25),
	location_description text,
	nearest_country varchar(3),
	eez_country varchar(3),
	shore_distance real,
	shore_longitude real,
	shore_latitude real,
	attack_description text,
	vessel_name varchar(75),
	vessel_type varchar(50),
	vessel_status varchar(50),
	data_source varchar(50)
);

\copy country_codes from pirate_attacks/country_codes.csv delimiter ',' csv
\copy country_indicators from pirate_attacks/country_indicators.csv delimiter ',' csv
\copy pirate_attacks from pirate_attacks/pirate_attacks.csv delimiter ',' csv
