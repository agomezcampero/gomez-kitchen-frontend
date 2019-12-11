import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { register } from "../services/userService";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import { Col, CardHeader, Card, CardBody, CardFooter } from "reactstrap";

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
      <React.Fragment>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-2">
              <div className="text-muted text-center mt-2">
                <small>Crear Cuenta</small>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <form onSubmit={this.handleSubmit}>
                {this.renderInput("email", "Usuario (email)")}
                {this.renderInput("password", "Contraseña", {
                  type: "password"
                })}
                {this.renderInput("name", "Nombre")}
                <div className="text-center">
                  {this.renderButton("Registrarse")}
                </div>
              </form>
            </CardBody>
            <CardFooter>
              <p className="text-center">
                ¿Ya tienes cuenta?
                <Link to="/auth/login"> Ingresar</Link>
              </p>
            </CardFooter>
          </Card>
        </Col>
      </React.Fragment>
    );
  }
}

export default RegisterForm;
