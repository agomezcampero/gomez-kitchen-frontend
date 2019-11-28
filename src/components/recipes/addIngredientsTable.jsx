import React, { Component } from "react";
import Table from "../common/table";
import Plus from "../common/plus";
import { Link } from "react-router-dom";

class AddIngredientsTable extends Component {
  columns = [
    {
      key: "plus",
      label: "",
      content: ingredient => (
        <Plus onClick={() => this.props.onAddedIngredient(ingredient)} />
      )
    },
    {
      label: "Nombre",
      path: "name"
    },
    { path: "price", label: "Precio" },
    {
      path: "amount&unit",
      label: "Cantidad",
      content: ingredient => `${ingredient.amount} ${ingredient.unit}`
    },
    {
      path: "liderId",
      label: "Lider",
      content: ingredient =>
        ingredient.liderId && <i className="fa fa-check"></i>
    }
  ];

  render() {
    const { ingredients } = this.props;

    if (!ingredients.length)
      return (
        <Link to="/ingredients">
          ¡Debes crear ingredientes, haz click aquí!
        </Link>
      );

    return <Table data={ingredients} columns={this.columns} sortable={false} />;
  }
}

export default AddIngredientsTable;
