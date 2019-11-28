import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getRecipe, saveRecipe } from "../../services/recipesService";
import auth from "../../services/authService";
import { toast } from "react-toastify";
import SlidingPane from "react-sliding-pane";
import Modal from "react-modal";
import { getMyIngredients } from "./../../services/ingredientsService";
import AddIngredientsTable from "./addIngredientsTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button
} from "reactstrap";

class RecipeForm extends Form {
  state = {
    data: {
      _id: "",
      name: "",
      ingredients: [],
      instructions: [],
      prepTime: "",
      servings: "",
      followers: [],
      owner: ""
    },
    errors: {},
    user: auth.getCurrentUser(),
    isPaneOpen: false,
    ingredientsToAdd: []
  };

  schema = {
    _id: Joi.string().allow(""),
    name: Joi.string()
      .required()
      .label("Nombre"),
    ingredients: Joi.array().required(),
    instructions: Joi.array().required(),
    prepTime: Joi.number().required(),
    servings: Joi.number().required(),
    followers: Joi.array().allow([]),
    owner: Joi.string()
      .allow("")
      .allow(null)
  };

  async componentDidMount() {
    Modal.setAppElement(this.el);

    const { data } = await getMyIngredients();
    this.setState({ ingredientsToAdd: data.data });

    const newRecipe = this.props.newRecipe;
    if (newRecipe) return;

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
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      followers: recipe.followers,
      owner: recipe.owner
    };
  }

  doSubmit = async () => {
    try {
      await saveRecipe(this.state.data);
      toast.success("Receta guardada");
    } catch (ex) {
      toast.error("No se pudo guardar la receta");
    }
  };

  handleIngredientDelete = ingredient => {
    const ingredients = this.state.data.ingredients.filter(
      i => i._id !== ingredient._id
    );
    let data = { ...this.state.data };
    data.ingredients = ingredients;

    this.setState({ data });
  };

  handleInstructionsDelete = index => {
    const instructions = [...this.state.data.instructions];
    instructions.splice(index, 1);
    let data = { ...this.state.data };
    data.instructions = instructions;

    this.setState({ data });
  };

  openPane = e => {
    e.preventDefault();
    this.setState({ isPaneOpen: true });
  };

  handleAddedIngredient = ingredient => {
    let data = { ...this.state.data };
    let ingredients = [...this.state.data.ingredients];
    ingredients.push({ ...ingredient });
    data.ingredients = ingredients;

    this.setState({ data });
  };

  handleIngredientChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data.ingredients[parseInt(input.name, 10)].amount = input.value;
    this.setState({ data });
  };

  handleInstructionsChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data.instructions[parseInt(input.name, 10)] = input.value;
    this.setState({ data });
  };

  addInstruction = e => {
    e.preventDefault();
    let instructions = [...this.state.data.instructions];
    let data = { ...this.state.data };
    instructions.push("");
    data.instructions = instructions;
    this.setState({ data });
  };

  render() {
    const { user, ingredientsToAdd, isPaneOpen } = this.state;
    const { ingredients, owner, name, instructions } = this.state.data;
    const { newRecipe } = this.props;
    const canEdit = (user && user._id === owner) || !owner;
    const options = canEdit ? {} : { disabled: true };
    return (
      <div ref={ref => (this.el = ref)}>
        <h4 className="mt-2">{(newRecipe && "Agregar Receta") || name}</h4>
        <form onSubmit={this.handleSubmit}>
          <div className="form-row">
            <div className="col-6">
              {this.renderInput("name", "Nombre", options)}
            </div>
            <div className="col-md-3 col-sm-6">
              {this.renderInput("prepTime", "Tiempo", options)}
            </div>
            <div className="col-md-3 col-sm-6">
              {this.renderInput("servings", "Porciones", options)}
            </div>
          </div>
          <div className="row mx-1">
            <h4 className="editable">Ingredientes</h4>
            {canEdit && (
              <button className="btn btn-primary ml-2" onClick={this.openPane}>
                Agregar Ingredientes
              </button>
            )}
            {ingredients.map((i, index) => (
              <InputGroup className="my-1" key={i._id}>
                <InputGroupAddon addonType="prepend">{i.name}</InputGroupAddon>
                <input
                  value={i.amount}
                  onChange={this.handleIngredientChange}
                  name={index}
                  className="form-control"
                ></input>
                {!isPaneOpen && (
                  <InputGroupAddon addonType="append">
                    <InputGroupText>{i.unit}</InputGroupText>
                    <Button
                      color="danger"
                      onClick={() => this.handleIngredientDelete(i)}
                    >
                      <i className="fa fa-times d.-none"></i>
                    </Button>
                  </InputGroupAddon>
                )}
              </InputGroup>
            ))}
            <SlidingPane
              isOpen={this.state.isPaneOpen}
              title="Selecciona Ingredientes para Agregar"
              onRequestClose={() => {
                // triggered on "<" on left top click or on outside click
                this.setState({ isPaneOpen: false });
              }}
            >
              <AddIngredientsTable
                ingredients={ingredientsToAdd}
                onAddedIngredient={this.handleAddedIngredient}
              />
            </SlidingPane>
          </div>
          <div className="row mx-1">
            <h4 className="editable">Instrucciones</h4>
            <button
              className="btn btn-primary ml-2"
              onClick={this.addInstruction}
            >
              Agregar Instrucción
            </button>
            {instructions.map((i, index) => (
              <InputGroup key={index} className="my-1">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>{index + 1}</InputGroupText>
                </InputGroupAddon>

                <textarea
                  value={i}
                  onChange={this.handleInstructionsChange}
                  name={index}
                  className="form-control"
                ></textarea>
                {!isPaneOpen && (
                  <InputGroupAddon addonType="append">
                    <button
                      className="btn btn-danger"
                      onClick={() => this.handleInstructionsDelete(index)}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </InputGroupAddon>
                )}
              </InputGroup>
            ))}
          </div>

          {canEdit && this.renderButton("Guardar")}
        </form>
      </div>
    );
  }
}

export default RecipeForm;
