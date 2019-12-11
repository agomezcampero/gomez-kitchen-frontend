import React from "react";
import { FormGroup, Input as RSInput } from "reactstrap";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <FormGroup>
      <label className="form-control-label" htmlFor={name}>
        {label}
      </label>
      <RSInput
        className="form-control-alternative"
        id={name}
        name={name}
        {...rest}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </FormGroup>
  );
};

Input.defaultProps = {
  type: "text",
  autoFocus: false
};

export default Input;
