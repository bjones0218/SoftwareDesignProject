import psycopg2


def test_query():
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
    print("Getting all of the country names in Latin America and the Caribean")
    cursor.execute("SELECT * FROM country_codes WHERE region LIKE 'Latin America & Caribbean'")
    rows = cursor.fetchall()
    for row in rows:
        if row is not None:
            print(row[2])

if __name__ == '__main__':
    test_query()
