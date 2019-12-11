import React, { Component } from "react";

class Plus extends Component {
  state = {
    loading: false
  };

  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  handleClick = async () => {
    this.setState({ loading: true });

    const response = await this.props.onClick();
    if (this._ismounted && (response || !response))
      this.setState({ loading: false });
  };

  render() {
    const { loading } = this.state;
    const classes = loading ? "fa fa-plus fa-spin" : "clickable fa fa-plus";

    return (
      <i onClick={this.handleClick} className={classes} aria-hidden="true"></i>
    );
  }
}

export default Plus;
