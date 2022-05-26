import { Navigate, Outlet } from "react-router-dom";

function useAuth() {
  if (sessionStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
}

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
