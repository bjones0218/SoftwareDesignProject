# We sourced a GeoJSON database with the outlines of all countries from the Web.
# this script gets the indicators about countries, like their GDP's, which were included
# in the SQL pirate attack database, and adds them to the properties of each feature
# in the GeoJSON.
import json
import psycopg2
import datetime
from json import JSONDecodeError

connection = psycopg2.connect(
    host = "localhost",
    port = 5432,
    database = "jonesb2",
    user = "jonesb2",
    password = "card254cup"
)
if connection is None:
    print("Connection failed")
cursor = connection.cursor()

# https://stackoverflow.com/questions/12309269/how-do-i-write-json-data-to-a-file
with open("static/raw_countries.geojson", "r", encoding="utf-8") as raw_country_file:
    try:
        raw_data = json.load(raw_country_file)
    except JSONDecodeError:
        print("Failed to decode raw country geoJSON")

# iterate over all existing features (country outlines)
i = 0
while (i < len(raw_data["features"])):
    feature = raw_data["features"][i]
    iso_country_code = feature["properties"]["ISO_A3"]
    # get that country's political and economic indicators from the SQL
    cursor.execute(f"SELECT country, current_year, corruption_index, homicide_rate, gdp, fisheries_per_ton, total_military, population, unemployment_rate, total_gr, gdp_industry FROM country_indicators WHERE country LIKE '{iso_country_code}'")
    country_indicators = cursor.fetchall()
    cursor.execute(f"SELECT nearest_country FROM pirate_attacks WHERE nearest_country LIKE '{iso_country_code}'")
    pirate_attacks_near_country = cursor.fetchall()
    # if we don't have data about the country, or no pirate attacks happened near it, remove it from the dataset
    if (iso_country_code == '-99' or len(country_indicators) == 0 or len(pirate_attacks_near_country) == 0):
        raw_data["features"].pop(i)
    else:
        # yearly data is stored in, e.g., data["features"][17]["indicators"][9]["gdp"]
        # this represents 2001 GDP (2001 - 1993 = 9)
        cursor.execute(f"SELECT region FROM country_codes WHERE country LIKE '{iso_country_code}'")
        region = cursor.fetchone()[0]
        feature["properties"]["region"] = region;
        STARTING_YEAR = 1993
        ENDING_YEAR = 2019
        country_indicators_time_series = [0] * (ENDING_YEAR - STARTING_YEAR + 1);
        for yearly_data in country_indicators:
            current_year = yearly_data[1]
            year_indicators = dict(corruption_index = yearly_data[2],
                                   homicide_rate = yearly_data[3],
                                   gdp = yearly_data[4],
                                   fisheries_per_ton = yearly_data[5],
                                   total_military = yearly_data[6],
                                   population = yearly_data[7],
                                   unemployment_rate = yearly_data[8],
                                   total_gr = yearly_data[9],
                                   gdp_industry = yearly_data[10])
            country_indicators_time_series[current_year - STARTING_YEAR] = year_indicators;
        feature["properties"]["indicators"] = country_indicators_time_series
        # if iso_country_code == "CHN":
            # print(feature["properties"])
        i += 1

print("These are all of the countries in the refined database")
for feature in raw_data["features"]:
    country_name = feature["properties"]["ADMIN"]
    print(country_name)

# https://stackoverflow.com/questions/12309269/how-do-i-write-json-data-to-a-file
with open("static/country_outlines_with_indicators.geojson", "w", encoding="utf-8") as output_file:
    json.dump(raw_data, output_file, ensure_ascii=False)

print("Dumped refined outline data, without countries that don't appear in pirate attack data, into new file country_outlines_with_indicators.geojson")
