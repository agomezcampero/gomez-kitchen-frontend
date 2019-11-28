import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";

class SearchForm extends Form {
  state = {
    data: { query: "" },
    errors: {}
  };

  schema = {
    query: Joi.string().allow("")
  };

  doSubmit = () => {
    this.props.onSubmit(this.state.data.query);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("query", "")}
            {this.renderButton(this.props.buttonText)}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default SearchForm;
