from crypt import methods

import os

import psycopg2
from email_validator import EmailNotValidError, validate_email
from flask import Flask, jsonify, request, session, url_for
from flask_mail import Mail, Message
from itsdangerous import URLSafeSerializer
from flask_cors import CORS
from psycopg2.errors import UniqueViolation

app = Flask(__name__)

app.config.from_pyfile("config.cfg")
CORS(
    app,
    supports_credentials=True,
    expose_headers="Set-Cookie",
)
mail = Mail(app)
s = URLSafeSerializer("Thisissecret!")


hostname = os.getenv("POSTGRES_HOST")
database = os.getenv("POSTGRES_DB")
postgres_user = os.getenv("POSTGRES_USER")
port_id = os.getenv("POSTGRES_PORT")

conn = psycopg2.connect(
    host=hostname, dbname=database, user=postgres_user, port=port_id
)

cur = conn.cursor()
conn.autocommit = True


@app.route("/is_logged_in", methods=["POST"])
def is_logged_in():
    if not session.get("user_id") is None:
        return jsonify({"message": "user logged in"}), 200
    return jsonify({"message": "user not logged in"}), 401


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
        return jsonify({"username": username})

    if not session["user_id"] == user_id:
        return jsonify({"message": "Bad Request"}), 400

    return jsonify({"username": username})


@app.route("/forgot_password", methods=["POST"])
def forgot_password():
    """FORGOT PASSWORD API
    Parameters:
    email (String): Email of user

    Returns:
        Http Response: {
            String : It can be either Message or username
            Integer : Status Code
        }
    """
    email = request.json.get("email")
    cur.execute("SELECT * FROM users WHERE email='{}'".format(email))
    user = cur.fetchone()
    if not user:
        return jsonify({"message": "User doesn't exist."})
    token = s.dumps(email)

    link = url_for(
        "confirm_email",
        token=token,
        _external=False,
    )
    msg = Message(
        "GeoVisualier Password Reset",
        sender="shalinisharma1297@gmail.com",
        recipients=[email],
    )
    msg.body = "Hello,\nPlease reset your password using this: http://localhost:3000{}\nThanks".format(
        link
    )

    mail.send(msg)

    return jsonify({"message": "Email sent successfully."})


@app.route("/confirm_email/<token>", methods=["POST"])
def confirm_email(token):
    """RESET PASSWORD API
    Request Body:
    token (String): token
    password (String): Password of user
    passwordPassword (String): Password of user

    Returns:
        Http Response: {
            String : It can be either Message or username
            Integer : Status Code
        }
    """
    password = request.json.get("password")
    confirm_password = request.json.get("confirmPassword")
    email_token = request.json.get("emailToken")
    try:
        if not password == confirm_password:
            return jsonify({"messge": "Both password is not same."})

        email = s.loads(email_token)
        cur.execute(
            "UPDATE users SET password = crypt('{}',password) WHERE email ='{}'".format(
                password, email
            )
        )
        return jsonify({"message": "Password updated successfully", "email": email})
    except:
        return jsonify(
            {
                "message": "It looks like you clicked on an invalid password reset link. Please try again."
            }
        )


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
