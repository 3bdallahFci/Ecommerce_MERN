import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../Context/AdminContext";



const ProtectedAdmin= ()=> {
  const { isAuth } = useAdminAuth();

  if (!isAuth) {
    return <Navigate to="/Adminlogin" replace />;
  }

  return <Outlet/>;
};

export default ProtectedAdmin;