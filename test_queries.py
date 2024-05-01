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
