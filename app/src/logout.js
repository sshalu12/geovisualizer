import "./login.css";

async function logoutUser() {
  await fetch("http://localhost:1000/logout", {
    method: "POST",
  }).then((response) => response.json());
}

function Logout() {
  logoutUser();
  window.open("/login", "_self");
  sessionStorage.removeItem("token");
}

export default Logout;
