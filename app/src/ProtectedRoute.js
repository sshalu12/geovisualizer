import { Navigate, Outlet } from "react-router-dom";
import React, { useState } from "react";

// const response = function IsloggedIn() {
const IsloggedIn = function () {
  return fetch("http://localhost:1000/is_logged_in", {
    method: "POST",
    credentials: "include",
  });
};
const ProtectedRoutes = () => {
  const [ans, setAns] = useState("false");
  const Protected = async () => {
    const useAuth = IsloggedIn().then(function (response) {
      return response.ok;
    });
    const isAuth = await useAuth;
    setAns(isAuth);
  };
  Protected();
  const isAuth = ans;
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
