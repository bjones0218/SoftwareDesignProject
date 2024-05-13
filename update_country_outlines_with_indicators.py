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
    print(feature["properties"])