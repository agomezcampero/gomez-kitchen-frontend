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
    const { recipes, ...rest } = this.props;

    return (
      <Table data={recipes} columns={this.columns} sortable={false} {...rest} />
    );
  }
}

export default AddRecipesTable;
