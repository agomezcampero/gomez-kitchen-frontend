import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import Plus from "../common/plus";
import { followRecipe } from "../../services/recipesService";
import { toast } from "react-toastify";

class RecipesSearchTable extends Component {
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
    {
      key: "plus",
      label: "",
      content: recipe => <Plus onClick={() => this.addRecipe(recipe)} />
    }
  ];

  async addRecipe(recipe) {
    try {
      await followRecipe(recipe._id);
      this.props.onAddedRecipe(recipe);
      this.props.onDelete(recipe);
    } catch (ex) {
      toast.error("Error agregando receta, volver a intentar");
    }
  }

  render() {
    const { recipes, ...rest } = this.props;

    if (!recipes.length)
      return <h2>No se encontraron recetas, pruebe otra búsqueda</h2>;

    return (
      <Table
        title="Resultados"
        data={recipes}
        columns={this.columns}
        sortable={false}
        {...rest}
      />
    );
  }
}

export default RecipesSearchTable;
