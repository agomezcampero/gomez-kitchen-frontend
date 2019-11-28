import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import Delete from "../common/delete";
import auth from "../../services/authService";
import Refresh from "./../common/refresh";

class RecipesTable extends Component {
  state = {
    user: auth.getCurrentUser()
  };

  columns = [
    {
      label: "Nombre",
      path: "name",
      content: recipe => (
        <Link to={`/recipes/${recipe._id}`}>{recipe.name}</Link>
      )
    },
    { path: "price", label: "Precio" },
    { path: "servings", label: "Porciones" },
    { path: "prepTime", label: "Tiempo" },
    {
      key: "refresh",
      label: "",
      content: recipe => (
        <Refresh
          refreshable={true}
          onClick={() => this.props.onRefresh(recipe)}
        />
      )
    },
    {
      key: "delete",
      label: "",
      content: recipe => <Delete onClick={() => this.props.onDelete(recipe)} />
    }
  ];

  render() {
    const { recipes, sortColumn, onSort } = this.props;

    return (
      <Table
        data={recipes}
        onSort={onSort}
        columns={this.columns}
        sortColumn={sortColumn}
      />
    );
  }
}

export default RecipesTable;
