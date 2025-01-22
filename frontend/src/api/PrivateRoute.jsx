import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authentication";

const PrivateRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default PrivateRoute;
