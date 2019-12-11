import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import logo from "./logo.svg";
import "./App.css";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import RegisterForm from "./components/registerForm";
import ProtectedRoute from "./components/common/protectedRoute";
import AdminLayout from "./layouts/Admin";
import UserLayout from "./layouts/User";
import AuthLayout from "./layouts/Auth";

function App() {
  return (
    <React.Fragment>
      <ToastContainer />
      <Switch>
        <Route path="/admin" component={AdminLayout} />
        <ProtectedRoute
          path="/user"
          render={props => <UserLayout {...props} />}
        />
        <Route path="/auth" render={props => <AuthLayout {...props} />} />
        <Route path="/register" component={RegisterForm} />
        <Route path="/login" component={LoginForm} />
        <ProtectedRoute path="/logout" component={Logout} />
        <Redirect from="/" to="/user/recipes" exact />
        <Redirect to="not-found" />
      </Switch>
    </React.Fragment>
  );
}

export default App;
