import json
import psycopg2
import datetime

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

# put all of the data in the GeoJSON, because we don't know what we need yet
cursor.execute("SELECT date, time, longitude, latitude, attack_type, location_description, nearest_country, eez_country, shore_distance, shore_longitude, shore_latitude, attack_description, vessel_name, vessel_type, vessel_status, data_source FROM pirate_attacks")
all_attacks = cursor.fetchall()
print(all_attacks[0])
for attack in all_attacks:
    longitude = attack[2]
    latitude = attack[3]
    # creating a point with the appropriate latitude and longitude
    # https://en.wikipedia.org/wiki/GeoJSON
    geoJSON_feature = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [longitude, latitude]}}
    # copying all extra data into the properties of the point
    properties = dict(attack_type = attack[4],
                      location_description = attack[5],
                      nearest_country = attack[6],
                      eez_country = attack[7],
                      shore_distance = attack[8],
                      shore_longitude = attack[9],
                      shore_latitude = attack[10],
                      attack_description = attack[11],
                      vessel_name = attack[12],
                      vessel_type = attack[13],
                      vessel_status = attack[14],
                      data_source = attack[15])
    # dates and times might be in a non-serializable format, fix them
    # https://pynative.com/python-serialize-datetime-into-json/
    if isinstance(attack[0], (datetime.date, datetime.datetime)):
        properties["date"] = attack[0].isoformat
    else:
        properties["date"] = attack[0]
    if isinstance(attack[0], (datetime.time)):
        properties["time"] = attack[0].isoformat
    else:
        properties["time"] = attack[0]
    geoJSON_feature["properties"] = properties
    data["features"].append(geoJSON_feature)

print(data["features"][0])

# https://stackoverflow.com/questions/12309269/how-do-i-write-json-data-to-a-file
with open("pirate_attacks.geojson", "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=4)