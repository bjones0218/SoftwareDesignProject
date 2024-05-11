import json
import psycopg2

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

with open("pirate_attacks.geojson", "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=4)