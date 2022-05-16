import os

import psycopg2
from email_validator import validate_email
from flask import Flask, jsonify, request, session

app = Flask(__name__)

hostname = os.getenv("POSTGRES_HOST")
database = os.getenv("POSTGRES_DB")
postgres_user = os.getenv("POSTGRES_USER")
port_id = os.getenv("POSTGRES_PORT")

conn = psycopg2.connect(
    host=hostname, dbname=database, user=postgres_user, port=port_id
)

cur = conn.cursor()


@app.route("/signup", methods=["POST"])
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

    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")

    if not (username and email and password):
        return (
            jsonify({"message": "either username or email or password is missing"}),
            400,
        )

    try:
        validate_email(email)
    except:
        return jsonify({"message": "email is not in correct format"}), 400

    if not (type(username) == str):
        return jsonify({"message": "username is not in correct format"}), 400

    if not (type(password) == str):
        return jsonify({"message": "password is not in correct format"}), 400

    cur.execute("SELECT email FROM users WHERE email='{}'".format(email))
    user_with_email = cur.fetchone()

    if user_with_email:
        return jsonify({"message": "User already exist"}), 400

    cur.execute(
        "INSERT INTO users (name,email,password) VALUES ('{}','{}',crypt('{}',gen_salt('bf')))".format(
            username, email, password
        )
    )
    conn.commit()
    return jsonify({"message": "User Registered Successfully"})


@app.route("/login", methods=["POST"])
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
    email = request.json.get("email")
    password = request.json.get("password")

    if not (email and password):
        return jsonify({"message": "either email or password is missing"}), 400

    try:
        validate_email(email)
    except:
        return jsonify({"message": "email is not in correct format"}), 400

    if not (type(password) == str):
        return jsonify({"message": "password is not in correct format"}), 400

    cur.execute(
        "SELECT * FROM users WHERE email='{}' AND password=crypt('{}',password)".format(
            email, password
        )
    )
    user = cur.fetchone()

    if not user:
        return jsonify({"message": "Email and/or password is incorrect"}), 401

    user_id, username = user[0], user[1]

    if session.get("user_id") is None:
        session["user_id"] = user_id
        return jsonify({"Username": username})

    if not session["user_id"] == user_id:
        return jsonify({"message": "Bad Request"}), 400

    return jsonify({"username": username})


@app.route("/logout", methods=["POST"])
def logout():
    """LOGOUT API

    Returns:
        Http Response: {
            String : Message
            Integer : Status Code
        }
    """
    if session.get("user_id") is None:
        return jsonify({"message": "Bad Request."}), 400

    session.pop("user_id", None)
    return jsonify({"message": "Logged Out Successfully."})


if __name__ == "__main__":
    app.secret_key = "necessaryforsession"
    app.run(debug=True, port=4000, host="0.0.0.0")
    conn.close()
