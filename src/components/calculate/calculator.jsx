import React, { Component } from "react";
import { Alert, Button, Label } from "reactstrap";
import SlidingPane from "react-sliding-pane";
import AddRecipesTable from "./addRecipesTable";
import { getMyRecipes } from "./../../services/recipesService";
import Modal from "react-modal";

class Calculator extends Component {
  state = {
    recipes: [],
    price: 0,
    isPaneOpen: false,
    recipesToAdd: []
  };

  async componentDidMount() {
    Modal.setAppElement(this.el);

    const { data } = await getMyRecipes();

    this.setState({
      recipesToAdd: data.data
    });
  }

  openPane = () => {
    this.setState({ isPaneOpen: true });
  };

  handleAddedRecipe = recipe => {
    let recipes = [...this.state.recipes];
    recipe.pricePerServing = recipe.price / recipe.servings;
    recipes.push({ ...recipe });

    this.setState({ recipes });
    this.setPrice(recipes);
  };

  getTotalPrice = (accumulator, currentValue) =>
    accumulator + currentValue.price;

  handleServingsChange = ({ currentTarget: input }) => {
    const recipes = [...this.state.recipes];
    const recipe = recipes[parseInt(input.name, 10)];
    recipe.servings = input.value;
    recipe.price = recipe.pricePerServing * recipe.servings;
    this.setState({ recipes });
    this.setPrice(recipes);
  };

  setPrice = recipes => {
    const price = recipes.reduce(this.getTotalPrice, 0);
    this.setState({ price });
  };

  render() {
    const { recipesToAdd, recipes } = this.state;
    return (
      <div ref={ref => (this.el = ref)}>
        <h1>Calcular Costo</h1>
        <Alert color="success">Precio Actual: ${this.state.price}</Alert>
        <Button color="success" onClick={this.openPane}>
          Agregar Receta
        </Button>
        <SlidingPane
          isOpen={this.state.isPaneOpen}
          title="Selecciona Receta para Agregar"
          onRequestClose={() => {
            // triggered on "<" on left top click or on outside click
            this.setState({ isPaneOpen: false });
          }}
        >
          <AddRecipesTable
            recipes={recipesToAdd}
            onAddedRecipe={this.handleAddedRecipe}
          />
        </SlidingPane>
        <div className="row my-2">
          <Label className="col">Nombre</Label>
          <Label className="col">Precio</Label>
          <Label className="col">Porciones</Label>
        </div>
        {recipes.map((r, index) => (
          <div className="row my-1" key={index}>
            <hr className="w-100" />
            <Label className="col">{r.name}</Label>
            <Label className="col">${r.price}</Label>
            <input
              name={index}
              className="col form-control"
              value={r.servings}
              onChange={this.handleServingsChange}
            ></input>
          </div>
        ))}
      </div>
    );
  }
}

export default Calculator;
