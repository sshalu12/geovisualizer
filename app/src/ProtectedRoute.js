import { Navigate, Outlet } from "react-router-dom";
import React, { useState } from "react";

const response = function IsloggedIn() {
  return fetch("http://localhost:1000/IsloggedIn", {
    method: "POST",
    credentials: "include",
  });
};
const ProtectedRoutes = () => {
  const [ans, setAns] = useState("false");
  const Protectedd = async () => {
    const useAuth = response().then(function (response) {
      return response.ok;
    });
    const isAuth = await useAuth;
    setAns(isAuth);
  };
  Protectedd();
  const isAuth = ans;
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
