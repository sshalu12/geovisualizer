import { Navigate, Outlet } from "react-router-dom";

function useAuth() {
  return !!sessionStorage.getItem("token")
}

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
