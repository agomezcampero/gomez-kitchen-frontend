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
        <Link to={`/user/recipes/${recipe._id}`}>{recipe.name}</Link>
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
    const { recipes, ...rest } = this.props;

    return (
      <Table
        title="Mis Recetas"
        data={recipes}
        columns={this.columns}
        {...rest}
      />
    );
  }
}

export default RecipesTable;
