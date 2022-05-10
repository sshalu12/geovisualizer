import json
import logging
from time import sleep
import os
import psycopg2
import togeojsontiles
from mapbox import Uploader

hostname = os.getenv('POSTGRES_HOST')
database = os.getenv('POSTGRES_DB')
username = os.getenv('POSTGRES_USER')
port_id = os.getenv('POSTGRES_PORT')

conn = psycopg2.connect(
    host=hostname,
    dbname=database,
    user=username,
    port=port_id
)
cur = conn.cursor()

cur.execute(
    "SELECT id,state,country,ST_AsGeoJSON(boundary,4326)::JSONB from states")
states_data = cur.fetchall()
conn.close()

if not states_data:
    logging.error("No data fetched from database ")
    quit()

states = []

for row in states_data:
    feature = {
        "type": "Feature",
        "properties": {"id": row[0], "state": row[1], "country": row[2]},
        "geometry": row[3],
    }
    states.append(feature)

geo = json.dumps({"type": "FeatureCollection", "features": states})

with open("./app/state.geojson", "w") as f:
    f.write(geo)

TIPPECANOE_DIR = '/usr/local/bin/'

togeojsontiles.geojson_to_mbtiles(
    filepaths=['./app/state.geojson'],
    tippecanoe_dir=TIPPECANOE_DIR,
    mbtiles_file='./app/state.mbtiles',
    maxzoom=10
)

service = Uploader()
mapid = "state"

with open('app/state.mbtiles', 'rb') as src:
    upload_resp = service.upload(src, mapid)

"""
response status code 422 indicates that the server understands the content type of the request entity,
and the syntax of the request entity is correct, but it was unable to process the contained instructions.
To overcome this problem script in sleep mode for 5 second and then retry.
"""

if upload_resp.status_code == 422:
    for request in range(5):
        sleep(5)
        with open('app/state.mbtiles', 'rb') as src:
            upload_resp = service.upload(src, mapid)
        if upload_resp.status_code != 422:
            break
