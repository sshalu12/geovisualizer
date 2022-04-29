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


@app.route('/login', methods=['POST'])
def login():

    email = request.json.get('email')
    password = request.json.get('password')
    cur.execute("SELECT * FROM users WHERE email='{}' ".format(email))
    user_email = cur.fetchone()
    
    if user_email :
        cur.execute(
            "SELECT * FROM users WHERE email='{}' AND password=crypt('{}',password)".format(email, password))
        user = cur.fetchone()
        if user:
            print(user)
            id = user[0]
            if 'user_id' in session:
                return jsonify({"username": user[1]})
            else:

                session['user_id'] = id
                return jsonify({"username": user[1]})
        else:
            return jsonify({"message": "The password that you've entered is incorrect. "}),401

    else:
        return jsonify({"message": "E-mail address does not exist."}),401



@app.route('/logout', methods=['POST'])
def logout():
    if 'user_id' in session:
        session.pop('user_id', None)
        return jsonify({"message": "log out successfully."})
    else:
        return jsonify({"message": "Bad request."})


if __name__ == "__main__":
    app.secret_key = 'necessaryforsession'
    app.run(debug=True, port=4000, host='0.0.0.0')
    conn.close()
