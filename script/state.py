import json
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

cur.execute('SELECT * from states')
query=cur.fetchall()
print(query)
cur.execute('SELECT ST_AsGeoJSON(boundary,4326)::JSONB from states ')
q=(cur.fetchall())
#append q data in list because q fetched data in list type and element of list is tuple 
state=[]
for i in range(0,len(q)):
    state.append(q[i][0])
k=[]
for i in range(0,len(query)):   
    m={
        "type":"Feature",
         "properties": {
                    "id":query[i][0],
                    "state":query[i][1],
                    "country":query[i][2]
                },

       "geometry":state[i]
    }
    k.append(m)
geo=json.dumps({
    "type": "FeatureCollection",
         "features": k})

with open('./usr/script/state.geojson', 'w') as f:
    f.write(geo) 
conn.close()