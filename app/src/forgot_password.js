import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

async function loginUser(credentials) {
  return fetch("http://localhost:1000/forgot_password", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((response) => response.json());
}

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formvalid = handleValidation();
    if (formvalid === true) {
      const response = await loginUser({
        email,
      });

      setResponseMessage(response.message);
    }
  };
  const handleValidation = (event) => {
    let formIsValid = true;

    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setEmailError("Email Not Valid");
      return false;
    } else {
      setEmailError("");
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
                <h4>Trouble with logging in?</h4>
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

              <button type="submit" className="btn btn-primary">
                Send Reset Password Link
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
