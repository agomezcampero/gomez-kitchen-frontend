import React, { Component } from "react";
import {
  getIngredients,
  getLiderIngredients
} from "../../services/ingredientsService";
import IngredientsSearchTable from "./ingredientsSearchTable";
import auth from "../../services/authService";
import SearchForm from "./../common/searchForm";

class IngredientSearch extends Component {
  state = {
    ingredients: [],
    pageSize: 10,
    currentPage: 1,
    user: auth.getCurrentUser()
  };

  handleSearch = async query => {
    const { user } = this.state;
    const { data } = await getIngredients(query);
    let ingredients = data.data;
    if (user) {
      ingredients = ingredients.filter(i => !i.followers.includes(user._id));
    }
    this.setState({ ingredients });
  };

  handleLiderSearch = async query => {
    const { data } = await getLiderIngredients(query);
    let ingredients = data.data;
    this.setState({ ingredients });
  };

  handleDelete = ingredient => {
    const ingredients = this.state.ingredients.filter(
      i => i._id !== ingredient._id
    );

    this.setState({ ingredients });
  };

  render() {
    const { ingredients } = this.state;
    return (
      <React.Fragment>
        <SearchForm
          onSubmit={this.handleSearch}
          buttonText="Buscar más ingredientes"
        />
        <SearchForm
          onSubmit={this.handleLiderSearch}
          buttonText="Buscar en Lider"
        />
        <IngredientsSearchTable
          ingredients={ingredients}
          onAddedIngredient={this.props.onAddedIngredient}
          onDelete={this.handleDelete}
        />
      </React.Fragment>
    );
  }
}

export default IngredientSearch;
