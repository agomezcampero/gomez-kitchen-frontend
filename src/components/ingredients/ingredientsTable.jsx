import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import Delete from "../common/delete";
import auth from "../../services/authService";
import Refresh from "./../common/refresh";
import Plus from "../common/plus";

class IngredientsTable extends Component {
  state = {
    user: auth.getCurrentUser()
  };

  itemClick = (e, ingredient) => {
    e.preventDefault();
    this.props.onItemClick(ingredient);
  };

  columns = [
    {
      label: "Nombre",
      path: "name",
      content: ingredient => (
        <Link
          to={`/ingredients/${ingredient._id}`}
          onClick={e => this.itemClick(e, ingredient)}
        >
          {ingredient.name}
        </Link>
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

  plusColumn = {
    label: "",
    path: "add",
    content: ingredient => (
      <Plus onClick={() => this.props.onAddedIngredient(ingredient)} />
    )
  };

  render() {
    const { ingredients, hasPlusColumn, ...rest } = this.props;
    const columns = hasPlusColumn
      ? [this.plusColumn, ...this.columns]
      : this.columns;

    return (
      <Table
        title="Mis Ingredientes"
        data={ingredients}
        columns={columns}
        {...rest}
      />
    );
  }
}

export default IngredientsTable;
