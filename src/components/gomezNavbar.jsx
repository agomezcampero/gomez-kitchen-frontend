import React, { useState } from "react";
import { NavLink as RRDNavLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink,
  NavItem
} from "reactstrap";
import auth from "../services/authService";

const GomezNavbar = props => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const user = auth.getCurrentUser();

  return (
    <Navbar sticky="top" color="light" light expand="md">
      <NavbarBrand tag={RRDNavLink} to="/">
        Gomez Kitchen
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink tag={RRDNavLink} to="/recipes">
              Recetas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RRDNavLink} to="/ingredients">
              Ingredientes
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RRDNavLink} to="/calculate">
              Calcular
            </NavLink>
          </NavItem>
        </Nav>
        {!user && (
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={RRDNavLink} to="/login">
                Ingresar
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRDNavLink} to="/register">
                Registrarse
              </NavLink>
            </NavItem>
          </Nav>
        )}
        {user && (
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={RRDNavLink} to="/profile">
                {user.name}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={RRDNavLink} to="/logout">
                Salir
              </NavLink>
            </NavItem>
          </Nav>
        )}
      </Collapse>
    </Navbar>
  );
};

export default GomezNavbar;
