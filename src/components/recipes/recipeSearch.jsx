import React, { Component } from "react";
import { getRecipes } from "../../services/recipesService";
import RecipesSearchTable from "./recipesSearchTable";
import auth from "../../services/authService";
import SearchForm from "./../common/searchForm";

class RecipeSearch extends Component {
  state = {
    recipes: [],
    pageSize: 10,
    currentPage: 1,
    user: auth.getCurrentUser()
  };

  handleSearch = async query => {
    const { user } = this.state;
    const { data } = await getRecipes(query);
    let recipes = data.data;
    if (user) {
      recipes = recipes.filter(r => !r.followers.includes(user._id));
    }
    this.setState({ recipes });
  };

  handleDelete = recipe => {
    const recipes = this.state.recipes.filter(r => r._id !== recipe._id);

    this.setState({ recipes });
  };

  render() {
    const { recipes } = this.state;
    return (
      <React.Fragment>
        <SearchForm
          buttonText="Buscar más recetas"
          onSubmit={this.handleSearch}
        />
        <RecipesSearchTable
          recipes={recipes}
          onAddedRecipe={this.props.onAddedRecipe}
          onDelete={this.handleDelete}
        />
        <button
          className="btn btn-success mt-2"
          onClick={this.props.onNewRecipe}
        >
          Nueva Receta
        </button>
      </React.Fragment>
    );
  }
}

export default RecipeSearch;
