import json
import psycopg2

hostname = "postgres"
database = "geovisualizer"
username = "postgres"

port_id = 5432
conn = psycopg2.connect(host=hostname, dbname=database, user=username, port=port_id)
cur = conn.cursor()

cur.execute("SELECT * from states")
query = cur.fetchall()

cur.execute("SELECT ST_AsGeoJSON(boundary,4326)::JSONB from states ")
multiploygon = cur.fetchall()

geometry = []
state = []

for i in range(0, len(query)):
    geometry.append(multiploygon[i][0])


for i in range(0, len(query)):
    feature = {
        "type": "Feature",
        "properties": {"id": query[i][0], "state": query[i][1], "country": query[i][2]},
        "geometry": geometry[i],
    }
    state.append(feature)

geo = json.dumps({"type": "FeatureCollection", "features": state})

try:
    with open("./usr/script/state.geojson", "w") as f:
        f.write(geo)
except EOFError as e:
    print(e)

conn.close()
