import json
import psycopg2
import togeojsontiles

hostname = 'postgres'
database='geovisualizer'
username='postgres'

port_id=5432
conn= psycopg2.connect(
        host=hostname,
        dbname=database,
        user=username,
        port=port_id
    )

cur=conn.cursor()
cur.execute('SELECT * from poi ')
query=cur.fetchall()
conn.close()

poi=[]

for data in query:   
    feature = {
        "type":"Feature",
        "properties": {
            "id":data[0],
            "business_name": data[1],
            "address": data[2],
            "city": data[3],
            "state": data[4],
            "zip": data[5],
            "country": data[8],
            "category_name": data[9],
            "category_id": data[10]
        },
        "geometry":{
            "type":"Point",
            "coordinates":[data[7],data[6]]
        }
    }
    poi.append(feature)

geo = json.dumps({
    "type": "FeatureCollection",
    "features": poi
})

try:
    with open('./app/poi.geojson', 'w') as f:
        f.write(geo)  
except Exception as e:
    print(e)


TIPPECANOE_DIR = '/usr/local/bin/'

togeojsontiles.geojson_to_mbtiles(
    filepaths=['./app/poi.geojson'],
    tippecanoe_dir=TIPPECANOE_DIR,
    mbtiles_file='./app/poi.mbtiles',
    maxzoom=10
)
