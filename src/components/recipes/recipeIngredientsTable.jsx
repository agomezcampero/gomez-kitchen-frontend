import React, { Component } from "react";
import Table from "../common/table";

class RecipeIngredientsTable extends Component {
  columns = [
    {
      label: "Nombre",
      path: "name"
    },
    {
      path: "amount&unit",
      label: "Cantidad",
      content: ingredient => `${ingredient.amount} ${ingredient.unit}`
    },
    { path: "price", label: "Precio" }
  ];

  render() {
    const { ingredients } = this.props;

    return <Table data={ingredients} columns={this.columns} sortable={false} />;
  }
}

export default RecipeIngredientsTable;
