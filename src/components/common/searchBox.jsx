import React from "react";
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap";

const SearchBox = ({ value, onChange, placeholder }) => {
  return (
    // <input
    //   type="text"
    //   className="form-control my-2"
    //   placeholder={placeholder}
    //   id="search"
    //   name="search"
    //   value={value}
    //   onChange={e => onChange(e.currentTarget.value)}
    // />
    <Form className="navbar-search navbar-search-light form-inline mr-3 d-none d-md-flex ml-lg-auto">
      <FormGroup className="mb-0">
        <InputGroup className="input-group-alternative">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-search" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            value={value}
            onChange={e => onChange(e.currentTarget.value)}
            placeholder="Buscar"
            type="text"
          />
        </InputGroup>
      </FormGroup>
    </Form>
  );
};

export default SearchBox;
