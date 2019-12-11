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
    const { ingredients, ...rest } = this.props;

    return (
      <Table
        title="Ingredientes"
        data={ingredients}
        columns={this.columns}
        sortable={false}
        {...rest}
      />
    );
  }
}

export default RecipeIngredientsTable;
