import psycopg2
hostname = 'postgres'
database='geovisualizer'
username='postgres'
pwd=''
port_id=5432
conn= psycopg2.connect(
        host=hostname,
        dbname=database,
        user=username,
        password=pwd,
        port=port_id
    )
cur=conn.cursor()
cur.execute('SELECT * FROM poi limit 1')
for record in cur.fetchall():
    print(record)
conn.close()
