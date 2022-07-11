import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";

async function confirmEmail(credentials) {
  return fetch("http://localhost:1000/confirm_email/<token>", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((response) => response.json());
}

function ConfirmEmail() {
  const params = useParams();
  const email_token = params["*"];
  const [password, setpassword] = useState("");
  const [passwordAgain, setpasswordAgain] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordAgainError, setPasswordAgainError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formvalid = handleValidation();
    if (formvalid === true) {
      const response = await confirmEmail({
        password,
        passwordAgain,
        email_token,
      });
      console.log(response);
      setResponseMessage(response.message);
    }
  };
  const handleValidation = (event) => {
    let formIsValid = true;

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
    if (!passwordAgain.match(/^\w{5,22}$/)) {
      formIsValid = false;
      setPasswordError(
        "Your password should be 5 to 22 characters long and contain only alpha character"
      );
      return false;
    } else {
      setPasswordAgainError("");
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
                <h2>Reset Password</h2>
                <div>
                  <p className="small ">{responseMessage}</p>
                </div>

                <label>New Password</label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  onChange={(e) => setpassword(e.target.value)}
                />
                <small className="text-danger form-text">{passwordError}</small>
              </div>
              <br></br>
              <div className="form-group">
                <label>New Password again</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password again"
                  onChange={(e) => setpasswordAgain(e.target.value)}
                />
                <small className="text-danger form-text">
                  {passwordAgainError}
                </small>
              </div>
              <br></br>

              <button type="submit" className="btn btn-primary">
                Reset Password
              </button>

              <div>
                <p style={{ "text-align": "center" }}>
                  <br></br>
                  <h4>
                    <a href="/login">Login</a>
                  </h4>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmEmail;
