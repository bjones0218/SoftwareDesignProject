import psycopg2


def test_query(sql):
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
    # print the names of all of the countries in Latin America and the Caribbean
    cursor.execute("SELECT * FROM country_codes WHERE region LIKE 'Latin America and Caribbean'")
    rows = cursor.fetchall()
    for row in rows:
        if row is not None:
            print(row[2])
