import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

async function loginUser(credentials) {
  return fetch("http://localhost:1000/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((Response) => {
    if (Response.status === 200) {
      window.location.href = "/locations";
    } else {
      return Response.json();
    }
  });
}

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [response_message, setresponse_message] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [emailError, setemailError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formvalid = handleValidation();
    if (formvalid === true) {
      const response = await loginUser({
        email,
        password,
      });

      setresponse_message(response["message"]);
      console.log(response_message);
    }
  };
  const handleValidation = (event) => {
    let formIsValid = true;

    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setemailError("Email Not Valid");
      return false;
    } else {
      setemailError("");
      formIsValid = true;
    }

    if (!password.match(/^\w{5,22}$/)) {
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
                <h2>Login</h2>
                <div>
                  <p className="small ">{response_message}</p>
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
                <br></br>Don't have an account? <a href="signup">Sign up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
