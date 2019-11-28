import React, { Component } from "react";
import { getRecipe } from "../../services/recipesService";
import auth from "../../services/authService";
import RecipeIngredientsTable from "./recipeIngredientsTable";

class Recipe extends Component {
  state = {
    data: {
      name: "",
      price: "",
      ingredients: [],
      instructions: [],
      prepTime: "",
      servings: "",
      followers: [],
      owner: ""
    },
    user: auth.getCurrentUser()
  };

  async componentDidMount() {
    const id = this.props.match.params.id;
    if (!id) return;
    await this.populateRecipe(id);
  }

  async populateRecipe(id) {
    try {
      const { data: recipe } = await getRecipe(id);
      this.setState({ data: this.mapToViewModel(recipe) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  mapToViewModel(recipe) {
    return {
      _id: recipe._id,
      name: recipe.name,
      price: recipe.price,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      followers: recipe.followers,
      owner: recipe.owner
    };
  }

  openRecipeToEdit = () => {
    const id = this.props.match.params.id;
    this.props.history.push(`/recipes/${id}/edit`);
  };

  render() {
    const {
      name,
      price,
      prepTime,
      servings,
      followers,
      ingredients,
      instructions,
      owner
    } = this.state.data;
    const { user } = this.state;
    return (
      <React.Fragment>
        <h1 className="editable">{name}</h1>
        {((user && owner === user._id) || !owner) && (
          <i
            className="blue clickable fa fa-pencil small"
            onClick={this.openRecipeToEdit}
          ></i>
        )}
        <br style={{ clear: "both" }} />

        <div className="card-deck">
          <div className="card text-white bg-primary">
            <div className="card-header">Precio</div>
            <div className="card-body">
              <h5 className="card-title">${price}</h5>
            </div>
          </div>
          <div className="card text-white bg-success">
            <div className="card-header">Tiempo de preparación</div>
            <div className="card-body">
              <h5 className="card-title">{prepTime} min</h5>
            </div>
          </div>
          <div className="card text-white bg-info">
            <div className="card-header">Porciones</div>
            <div className="card-body">
              <h5 className="card-title">{servings} porciones</h5>
            </div>
          </div>
          <div className="card text-white bg-secondary">
            <div className="card-header">Seguidores</div>
            <div className="card-body">
              <h5 className="card-title">{followers.length}</h5>
            </div>
          </div>
        </div>
        <h3>Ingredientes</h3>
        <RecipeIngredientsTable ingredients={ingredients} />
        <h3>Instrucciones</h3>
        {instructions.map((i, index) => (
          <p key={index}>
            {index + 1}. {i}
          </p>
        ))}
      </React.Fragment>
    );
  }
}

export default Recipe;
