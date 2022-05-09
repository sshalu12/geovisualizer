import os

import psycopg2
from flask import Flask, jsonify, request, session

app = Flask(__name__)

hostname = os.getenv('POSTGRES_HOST')
database = os.getenv('POSTGRES_DB')
username = os.getenv('POSTGRES_USER')

port_id = 5432
conn = psycopg2.connect(
    host=hostname,
    dbname=database,
    user=username,
    port=port_id
)

cur = conn.cursor()

@app.route('/signup', methods=['POST'])
def signup():
    """SIGNUP API
    Parameters:
    username (String): Username of user
    email (String): Email of user
    password (String): Password of user

    Returns:
        Http Response: {
            String : Message 
            Integer : Status Code
        }
    """

    username=request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')
    cur.execute("SELECT email FROM users WHERE email='{}'".format(email))
    user_with_email=cur.fetchone()

    if user_with_email :
        return jsonify({"Message": "User already exist"}),400
        
    cur.execute("INSERT INTO users (name,email,password) VALUES ('{}','{}',crypt('{}',gen_salt('bf')))".format(username,email,password))
    conn.commit()
    return jsonify({"Message": "User Registered Successfully"})
        


@app.route('/login', methods=['POST'])
def login():
    """LOGIN API
    Parameters:
    email (String): Email of user
    password (String): Password of user

    Returns:
        Http Response: {
            String : It can be either Message or username
            Integer : Status Code
        }
    """
    email = request.json.get('email')
    password = request.json.get('password')
    cur.execute("SELECT * FROM users WHERE email='{}' AND password=crypt('{}',password)".format(email, password))
    user = cur.fetchone()

    if not user:
        return jsonify({"Message": "Either email or password is incorrect"}),401
    
    id,username=user[0],user[1]

    if not 'user_id' in session: 
        session['user_id'] = id
        return jsonify({"Username": username})
    
    if not session['user_id']==id:
        return jsonify({"Message":"Bad Request"}),400

    return jsonify({"username": username})
  

@app.route('/logout', methods=['POST'])
def logout():
    """LOGOUT API

    Returns:
        Http Response: {
            String : Message
            Integer : Status Code
        }
    """
    if not 'user_id' in session:
        return jsonify({"Message": "Bad Request."}),400
    
    session.pop('user_id', None)
    return jsonify({"Message": "Logged Out Successfully."})


if __name__ == "__main__":
    app.secret_key = 'necessaryforsession'
    app.run(debug=True, port=4000, host='0.0.0.0')
    conn.close()
