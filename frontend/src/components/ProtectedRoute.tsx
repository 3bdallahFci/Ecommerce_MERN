import { Navigate, Outlet } from "react-router";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = () => {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
};


export default ProtectedRoute;