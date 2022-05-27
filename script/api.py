import os

import psycopg2
from email_validator import EmailNotValidError, validate_email
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from psycopg2.errors import UniqueViolation

app = Flask(__name__)
CORS(app)

hostname = os.getenv("POSTGRES_HOST")
database = os.getenv("POSTGRES_DB")
postgres_user = os.getenv("POSTGRES_USER")
port_id = os.getenv("POSTGRES_PORT")

conn = psycopg2.connect(
    host=hostname, dbname=database, user=postgres_user, port=port_id
)

cur = conn.cursor()
conn.autocommit = True


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

    if not (username and type(username) == str):
        return jsonify({"message": "please provide valid username"}), 400

    try:
        if not (email and type(email) == str):
            return jsonify({"message": "please provide valid email"}), 400
        user_email = validate_email(email).email
    except EmailNotValidError as error:
        return jsonify({"message": f"{error}"}), 400

    if not (password and type(password) == str):
        return jsonify({"message": "please provide valid password"}), 400

    try:
        cur.execute(
            "INSERT INTO users (name,email,password) VALUES ('{}','{}',crypt('{}',gen_salt('bf')))".format(
                username, user_email, password
            )
        )
        return jsonify({"message": "user registered successfully"})
    except UniqueViolation:
        return jsonify({"message": "user already exist"}), 400


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

    try:
        if not (email and type(email) == str):
            return jsonify({"message": "please provide valid email"}), 400
        user_email = validate_email(email).email
    except EmailNotValidError as error:
        return jsonify({"message": f"{error}"}), 400

    if not (password and type(password) == str):
        return jsonify({"message": "please provide valid password"}), 400

    cur.execute(
        "SELECT * FROM users WHERE email='{}' AND password=crypt('{}',password)".format(
            user_email, password
        )
    )
    user = cur.fetchone()

    if not user:
        return jsonify({"message": "Email and/or password is incorrect"}), 401

    user_id, username = user[0], user[1]

    if session.get("user_id") is None:
        session["user_id"] = user_id
        return jsonify({"username": username, "token": "test123"})

    if not session["user_id"] == user_id:
        return jsonify({"message": "Bad Request"}), 400

    return jsonify({"username": username, "token": "test123"})


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
    return jsonify({"message": "logged out successfully."})


if __name__ == "__main__":
    app.secret_key = "necessaryforsession"
    app.run(debug=True, port=4000, host="0.0.0.0")
    conn.close()
