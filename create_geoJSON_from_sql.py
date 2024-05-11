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

cursor.execute("SELECT date, time, longitude, latitude, attack_type, location_description, nearest_country, eez_country, shore_distance, shore_longitude, shore_latitude, attack_description, vessel_name, vessel_type, vessel_status, data_source FROM pirate_attacks")
all_attacks = cursor.fetchall()
print(all_attacks[0])

with open("pirate_attacks.geojson", "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=4)