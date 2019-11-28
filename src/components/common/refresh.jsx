import React, { Component } from "react";

class Refresh extends Component {
  state = {
    loading: false
  };

  handleClick = async () => {
    this.setState({ loading: true });

    const response = await this.props.onClick();
    if (response || !response) this.setState({ loading: false });
  };

  render() {
    const { refreshable } = this.props;
    const { loading } = this.state;
    const classes = loading
      ? "fa fa-refresh fa-spin"
      : "clickable fa fa-refresh";
    if (!refreshable) return null;
    return (
      <i onClick={this.handleClick} className={classes} aria-hidden="true"></i>
    );
  }
}

export default Refresh;
