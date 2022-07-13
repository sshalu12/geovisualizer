import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

async function loginUser(credentials) {
  return fetch("http://localhost:1000/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((response) => response.json());
}

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formvalid = handleValidation();
    if (formvalid === true) {
      const response = await loginUser({
        email,
        password,
      });

      if (response["username"]) {
        window.open("/locations", "_self");
      } else {
        setResponseMessage(response.message);
      }
    }
  };
  const handleValidation = (event) => {
    let formIsValid = true;

    if (!email.match(/[a-z0-9._%+-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setEmailError("Email Not Valid");
      return false;
    } else {
      setEmailError("");
      formIsValid = true;
    }

    if (!password.match(/^\w{5,22}$/)) {
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
                <h2>Login</h2>
                <div>
                  <p className="small ">{responseMessage}</p>
                </div>

                <label>Email address</label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                />
                <small className="text-danger form-text">{passwordError}</small>
              </div>
              <br></br>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <p>
                <br></br> <a href="forgotpassword">Forgot Password?</a>
              </p>
              <p>
                Don't have an account? <a href="signup">Sign up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
