import re
import json
import psycopg2
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

poi=[]

for i in range(0,len(query)):   
    feature={
        "type":"Feature",
         "properties": {
                    "id":query[i][0],
                    "business_name":query[i][1],
                    "address":query[i][2],
                    "city":query[i][3],
                    "state":query[i][4],
                    "zip":query[i][5],
                    "country":query[i][8],
                    "category_name":query[i][9],
                    "category_id":query[i][10]
                },
       "geometry":{
                    "type":"Point",
                    "coordinates":[
                        query[i][7],query[i][6]
                    ]
                }

    }
    poi.append(feature)

geo=json.dumps({
    "type": "FeatureCollection",
         "features": poi})

try:
    with open('./usr/script/poi.geojson', 'w') as f:
        f.write(geo)  
except EOFError as e:
    print(e)

conn.close()
