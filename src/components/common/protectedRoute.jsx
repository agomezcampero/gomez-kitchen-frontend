import React from "react";
import auth from "../../services/authService";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = props => {
  const user = auth.getCurrentUser();
  if (!user) return <Redirect to="/auth/login" />;

  return <Route {...props} />;
};

export default ProtectedRoute;
