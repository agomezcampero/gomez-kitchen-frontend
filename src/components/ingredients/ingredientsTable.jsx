import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import Delete from "../common/delete";
import auth from "../../services/authService";
import Refresh from "./../common/refresh";

class IngredientsTable extends Component {
  state = {
    user: auth.getCurrentUser()
  };

  columns = [
    {
      label: "Nombre",
      path: "name",
      content: ingredient => (
        <Link to={`/ingredients/${ingredient._id}`}>{ingredient.name}</Link>
      )
    },
    { path: "price", label: "Precio" },
    {
      path: "amount&unit",
      label: "Cantidad",
      content: ingredient => `${ingredient.amount} ${ingredient.unit}`
    },
    {
      path: "liderId",
      label: "ID Lider"
    },
    {
      key: "refresh",
      label: "",
      content: ingredient => (
        <Refresh
          onClick={() => this.props.onRefresh(ingredient)}
          refreshable={ingredient.liderId}
        />
      )
    },
    {
      key: "delete",
      label: "",
      content: ingredient => (
        <Delete onClick={() => this.props.onDelete(ingredient)} />
      )
    }
  ];

  render() {
    const { ingredients, sortColumn, onSort } = this.props;

    return (
      <Table
        data={ingredients}
        onSort={onSort}
        columns={this.columns}
        sortColumn={sortColumn}
      />
    );
  }
}

export default IngredientsTable;
