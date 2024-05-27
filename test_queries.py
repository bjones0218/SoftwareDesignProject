#This python file runs test queries in order to make sure our database is as expected.

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

def test_query():
    # print the names of all of the countries in Latin America and the Caribbean
    print("Getting all of the country names in Latin America and the Caribean")
    cursor.execute("SELECT * FROM country_codes WHERE region LIKE 'Latin America & Caribbean'")
    rows = cursor.fetchall()
    for row in rows:
        if row is not None:
            print(row[2])

def test_query_pirate_attacks():

    sql_attack_type = "SELECT location_description FROM pirate_attacks WHERE attack_type = 'Attempted' LIMIT 1;"
    sql_long_lat = "SELECT date FROM pirate_attacks WHERE longitude BETWEEN 110 AND 120 AND latitude BETWEEN 20 AND 25 ORDER BY date DESC LIMIT 1; "
    sql_country_shore = "SELECT nearest_country, eez_country FROM pirate_attacks WHERE shore_distance BETWEEN 279 AND 280 AND shore_longitude BETWEEN 55 AND 56 AND shore_latitude BETWEEN 17 AND 18"
    sql_name_source_status = "SELECT vessel_name, data_source FROM pirate_attacks WHERE vessel_status = 'Anchored' LIMIT 1; "
    sql_vesseltype_attackdis_time = "SELECT vessel_type, time FROM pirate_attacks WHERE attack_description = 'NA' LIMIT 1;"  
    
    cursor.execute( sql_attack_type )
    row = cursor.fetchone()
    if (row != None):
        print("attack type and location description test succeed, location:", row[0])
        print("")
    else:
        print("attack type and location description test failed.")
        print("")

    cursor.execute( sql_long_lat )
    row = cursor.fetchone()
    if (row != None):
        print("date, latitude and longitude test succeed, date:", row[0])
        print("")
    else:
        print("date, latitude and longitude test failed.")
        print("")

    cursor.execute( sql_country_shore )
    rowlist = cursor.fetchall()
    if (rowlist != None):
        print("The answer should include OMN, OMN")
        for row in rowlist:
            print("country and shore test succeed, country code:", row)
        print("")
    else:
        print("country and shore test failed.")
        print("")
        
    cursor.execute( sql_name_source_status )
    row = cursor.fetchone()
    if (row != None):
        print("name, source and status test succeed, name and source:", row)
        print("")
    else:
        print("name, source and status test failed.")
        print("")

    cursor.execute( sql_vesseltype_attackdis_time )
    row = cursor.fetchone()
    if (rowlist != None):
        print("vessel_type, sttack_discription, and time test succeed, vessel type and time:", row)
        print("")
    else:
        print("vessel_type, sttack_discription, and time test failed.")
        print("")
    
    
    return None

if __name__ == '__main__':
    test_query()
    test_query_pirate_attacks()
