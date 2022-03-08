import json
import psycopg2
import togeojsontiles
from mapbox import Uploader

hostname = "postgres"
database = "geovisualizer"
username = "postgres"

port_id = 5432
conn = psycopg2.connect(host=hostname, dbname=database, user=username, port=port_id)
cur = conn.cursor()

cur.execute("SELECT id,state,country,ST_AsGeoJSON(boundary,4326)::JSONB from states")
states_data = cur.fetchall()
conn.close()

states = []

for row in states_data:
    feature = {
        "type": "Feature",
        "properties": {"id": row[0], "state": row[1], "country": row[2]},
        "geometry": row[3],
    }
    states.append(feature)

geo = json.dumps({"type": "FeatureCollection", "features": states})

try:
    with open("./app/state.geojson", "w") as f:
        f.write(geo)
except Exception as e:
    print(e)

TIPPECANOE_DIR = '/usr/local/bin/'

togeojsontiles.geojson_to_mbtiles(
    filepaths=['./app/state.geojson'],
    tippecanoe_dir=TIPPECANOE_DIR,
    mbtiles_file='./app/state.mbtiles',
    maxzoom=10
)

service= Uploader()
mapid = "state"

try:
    with open('app/state.mbtiles', 'rb') as src:
        upload_resp = service.upload(src, mapid)
except Exception as e:
    print(e)
