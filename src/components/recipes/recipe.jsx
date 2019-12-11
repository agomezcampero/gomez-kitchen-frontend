import React, { Component } from "react";
import { getRecipe } from "../../services/recipesService";
import auth from "../../services/authService";
import RecipeIngredientsTable from "./recipeIngredientsTable";
import { Container, Col, Row } from "reactstrap";
import RecipeHeader from "../Headers/RecipeHeader";
import { paginate } from "./../../utils/paginate";
import RecipeInstructions from "./recipeInstructions";
import { withRouter } from "react-router-dom";

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
    pageSize: 25,
    currentPage: 1,
    user: auth.getCurrentUser()
  };

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
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
    const { ingredients, instructions, owner } = this.state.data;
    const { user, data, pageSize, currentPage } = this.state;
    const pagedIngredients = paginate(ingredients, currentPage, pageSize);
    const canEdit = user && (user._id === owner || !owner);
    return (
      <React.Fragment>
        <RecipeHeader recipe={data} canEdit={canEdit} />
        <Container className="mt--7" fluid>
          <RecipeIngredientsTable
            ingredients={pagedIngredients}
            itemsCount={ingredients.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
          <Row className="mt-5">
            <Col>
              <RecipeInstructions instructions={instructions} />
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(Recipe);
