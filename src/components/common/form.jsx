import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";
import _ from "lodash";

class Form extends Component {
  state = {
    data: {},
    errors: {},
    loading: false
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path.join(".")] = item.message;
    }

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const nameSplit = name.split(".");
    const obj = { [nameSplit[nameSplit.length - 1]]: value };
    let schema;
    if (nameSplit.length === 1) schema = { [name]: this.schema[name] };
    else if (nameSplit.length === 3) {
      const children = this.arraySchemas[nameSplit[0]]._inner.children;
      for (let i = 0; i < children.length; i++) {
        if (children[i].key === nameSplit[2]) {
          schema = { [nameSplit[2]]: children[i].schema };
        }
      }
    }
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    const response = await this.doSubmit();
    if (response || !response) this.setState({ loading: false });
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    const nameSplit = input.name.split(".");
    if (nameSplit.length === 1) data[input.name] = input.value;
    else if (nameSplit.length === 2)
      data[nameSplit[0]][nameSplit[1]] = input.value;
    else if (nameSplit.length === 3)
      data[nameSplit[0]][nameSplit[1]][nameSplit[2]] = input.value;

    this.setState({ data, errors });
  };

  renderButton(label) {
    const { loading } = this.state;
    return (
      <button disabled={this.validate() || loading} className="btn btn-primary">
        {!loading && label}
        {loading && <i className="fa fa-spinner fa-spin"></i>}
      </button>
    );
  }

  renderInput(name, label, options = {}) {
    const { data, errors } = this.state;

    return (
      <Input
        name={name}
        label={label}
        value={_.get(data, name)}
        onChange={this.handleChange}
        error={errors[name]}
        type={options.type || "text"}
        disabled={options.disabled || false}
      />
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        label={label}
        value={data[name]}
        onChange={this.handleChange}
        error={errors[name]}
        options={options}
      />
    );
  }
}

export default Form;
