import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./signup.css";

async function SignupUser(credentials) {
  return fetch("http://localhost:1000/signup", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((Response) => Response.json());
}

function Signup() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [responsMessage, setResponseMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formvalid = handleValidation();
    if (formvalid === true) {
      const response = await SignupUser({
        username,
        email,
        password,
      });
      setResponseMessage(response.message);
    }
  };

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!username.match(/^[a-zA-Z]{5,22}$/)) {
      formIsValid = false;
      setUsernameError("Invalid username");
      return false;
    } else {
      setUsernameError("");
      formIsValid = true;
    }

    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setEmailError("Email Not Valid");
      return false;
    } else {
      setEmailError("");
      formIsValid = true;
    }

    if (!password.match(/^[a-zA-Z]{5,22}$/)) {
      formIsValid = false;
      setPasswordError(
        "Your password should be 5 to 22 characters long and contain only alpha character"
      );
      return false;
    } else {
      setPasswordError("");
      formIsValid = true;
    }

    return formIsValid;
  };

  return (
    <div className="App">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-4">
            <form id="loginform" onSubmit={handleSubmit}>
              <div className="form-group">
                <h2>Signup</h2>
                <div>
                  <div>
                    <p className="response ">{responsMessage}</p>
                  </div>
                </div>
                <label>Username</label>

                <input
                  type="username"
                  className="form-control"
                  placeholder="Enter username"
                  onChange={(event) => setUsername(event.target.value)}
                />
                <small className="text-danger form-text">{usernameError}</small>
              </div>
              <br></br>
              <div>
                <label>Email address</label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <small className="text-danger form-text">{emailError}</small>
              </div>
              <br></br>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <small className="text-danger form-text">{passwordError}</small>
              </div>
              <br></br>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>

              <p>
                <br></br>Have an account? <a href="login">Log In</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
