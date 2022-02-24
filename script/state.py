import json
import psycopg2

hostname = "postgres"
database = "geovisualizer"
username = "postgres"

port_id = 5432
conn = psycopg2.connect(host=hostname, dbname=database, user=username, port=port_id)
cur = conn.cursor()

cur.execute("SELECT *,ST_AsGeoJSON(boundary,4326)::JSONB from states")
query = cur.fetchall()
conn.close()

state = []

for i in query:
    feature = {
        "type": "Feature",
        "properties": {"id": i[0], "state": i[1], "country": i[2]},
        "geometry": i[4],
    }
    state.append(feature)

geo = json.dumps({"type": "FeatureCollection", "features": state})

try:
    with open("./app/state.geojson", "w") as f:
        f.write(geo)
except Exception as e:
    print(e)


