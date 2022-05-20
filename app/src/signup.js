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
  const [response_message, setresponse_message] = useState("");

  const [passwordError, setpasswordError] = useState("");
  const [emailError, setemailError] = useState("");
  const [usernameError, setusernameError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formvalid = handleValidation();
    if (formvalid === true) {
      const response = await SignupUser({
        username,
        email,
        password,
      });
      console.log(response);
      setresponse_message(response["message"]);
    }
  };

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!username.match(/^[a-zA-Z]{5,22}$/)) {
      formIsValid = false;
      setusernameError("Invalid username");
      return false;
    } else {
      setusernameError("");
      formIsValid = true;
    }

    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setemailError("Email Not Valid");
      return false;
    } else {
      setemailError("");
      formIsValid = true;
    }

    if (!password.match(/^[a-zA-Z]{5,22}$/)) {
      formIsValid = false;
      setpasswordError("Invalid password");
      return false;
    } else {
      setpasswordError("");
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
                    <p className="response ">{response_message}</p>
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
