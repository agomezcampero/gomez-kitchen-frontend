import React, { Component } from "react";
import Table from "../common/table";
import Plus from "../common/plus";

class AddRecipesTable extends Component {
  columns = [
    {
      key: "plus",
      label: "",
      content: recipe => (
        <Plus onClick={() => this.props.onAddedRecipe(recipe)} />
      )
    },
    {
      label: "Nombre",
      path: "name"
    },
    { path: "price", label: "Precio" },
    {
      path: "servings",
      label: "Porciones"
    }
  ];

  render() {
    const { recipes } = this.props;

    if (!recipes.length) return null;

    return <Table data={recipes} columns={this.columns} sortable={false} />;
  }
}

export default AddRecipesTable;
