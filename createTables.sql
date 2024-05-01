DROP TABLE IF EXISTS country_codes;
DROP TABLE IF EXISTS country_information;
DROP TABLE IF EXISTS pirate_attacks;

CREATE TABLE country_codes (
	country varchar(3),
	region varchar(50),
	country_name varchar(50)
);

CREATE TABLE country_indicators (
	country varchar(3),
	current_year year,
	corruption_index real,
	homicide_rate real,
	gdp real,
	fisheries_per_ton real,
	total_military real,
	population int,
	unemployment_rate real,
	total_gr real,
	gdp_industry real
);

CREATE TABLE pirate_attacks (
	date date,
	time timestamp,
	longitude real,
	latitude real,
	attack_type varchar(25),
	location_description varchar(50),
	nearest_country varchar(3),
	eez_country varchar(3),
	shore_distance real,
	shore_longitude real,
	shore_latitude real,
	attack_description varchar(50),
	vessel_name varchar(50),
	vessel_type varchar(50),
	vessel_status varchar(50),
	data_source varchar(50)
);

\copy country_codes from country_codes.csv delimiter ',' csv
\copy country country_indicators from country_indicators.csv delimiter ',' csv
\copy pirate_attacks from pirate_attacks.csv delimiter ',' csv
