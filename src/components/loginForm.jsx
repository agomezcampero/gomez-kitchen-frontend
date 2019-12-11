import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "./../services/authService";
import { Redirect, Link } from "react-router-dom";
import { Card, CardBody, CardHeader, CardFooter, Col } from "reactstrap";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Usuario (email)"),
    password: Joi.string()
      .required()
      .label("Contraseña")
  };

  doSubmit = async () => {
    try {
      const { username, password } = this.state.data;
      await auth.login(username, password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <React.Fragment>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-2">
              <div className="text-muted text-center mt-2">
                <small>Ingresar</small>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <form onSubmit={this.handleSubmit}>
                {this.renderInput("username", "Usuario (email)")}
                {this.renderInput("password", "Contraseña", {
                  type: "password"
                })}
                <div className="text-center">
                  {this.renderButton("Ingresar")}
                </div>
              </form>
            </CardBody>
            <CardFooter>
              <p className="text-center">
                ¿Usuario Nuevo?
                <Link to="/auth/register"> Registrarse</Link>
              </p>
            </CardFooter>
          </Card>
        </Col>
      </React.Fragment>
    );
  }
}

export default LoginForm;
