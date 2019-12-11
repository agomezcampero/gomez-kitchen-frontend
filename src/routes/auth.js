import LoginForm from "./../components/loginForm";
import RegisterForm from "./../components/registerForm";
import Login from "./../views/examples/Login";

var routes = [
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-tv-2 text-primary",
    component: LoginForm,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Registro",
    component: RegisterForm,
    icon: "ni ni-tv-2 text-primary",
    layout: "/auth"
  }
];

export default routes;
