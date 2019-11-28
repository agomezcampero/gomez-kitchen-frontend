import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { register } from "../services/userService";
import auth from "../services/authService";

class RegisterForm extends Form {
  state = {
    data: { email: "", password: "", name: "" },
    errors: {}
  };

  schema = {
    email: Joi.string()
      .email()
      .required()
      .label("Usuario (email)"),
    password: Joi.string()
      .min(5)
      .required()
      .label("Contraseña"),
    name: Joi.string()
      .required()
      .label("Nombre")
  };

  doSubmit = async () => {
    try {
      const response = await register(this.state.data);
      auth.loginWithRegister(response);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Usuario (email)")}
          {this.renderInput("password", "Contraseña", { type: "password" })}
          {this.renderInput("name", "Nombre")}
          {this.renderButton("Registrarse")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
