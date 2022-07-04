import "./login.css";

async function logoutUser() {
  await fetch("http://localhost:1000/logout", {
    method: "POST",
    credentials: "include",
  }).then((response) => {
    console.log(response);
    if (response.status === 200) {
      window.open("/login", "_self");
    } else {
      window.open("/login", "_self");
    }
  });
}

function Logout() {
  logoutUser();
}

export default Logout;
