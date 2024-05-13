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

data = {
    "type": "FeatureCollection",
    "features": []
}

# https://stackoverflow.com/questions/12309269/how-do-i-write-json-data-to-a-file
with open("static/raw_countries.geojson", "r", encoding="utf-8") as raw_country_file:
    try:
        raw_data = json.load(raw_country_file)
    except JSONDecodeError:
        print("Failed to decode raw country geoJSON")

for feature in raw_data["features"]:
    iso_country_code = feature["properties"]["ISO_A3"]
    # print(feature["properties"]["ISO_A3"])
    cursor.execute(f"SELECT country, current_year, corruption_index, homicide_rate, gdp, fisheries_per_ton, total_military, population, unemployment_rate, total_gr, gdp_industry FROM country_indicators WHERE country LIKE '{iso_country_code}'")
    country_indicators = cursor.fetchall()
    cursor.execute(f"SELECT nearest_country FROM pirate_attacks WHERE nearest_country LIKE '{iso_country_code}'")
    pirate_attacks = cursor.fetchall()
    if (iso_country_code.equals('-99') or len(country_indicators) == 0 or len(pirate_attacks) == 0):
        print(f"Removing {feature['properties']['ADMIN']}")
        raw_data["features"].remove(feature)
    if (iso_country_code == "CHN"):
        print(feature["properties"])
        for row in country_indicators:
            print(row)

for feature in raw_data["features"]:
    iso_country_code = feature["properties"]["ISO_A3"]
    print(feature["properties"]["ISO_A3"])

cursor.execute("SELECT * FROM country_codes WHERE country LIKE '-99'")
print(cursor.fetchone())
cursor.execute("SELECT * FROM country_indicators WHERE country LIKE '-99'")
print(cursor.fetchone())
cursor.execute("SELECT * FROM pirate_attacks WHERE nearest_country LIKE '-99'")
print(cursor.fetchone())