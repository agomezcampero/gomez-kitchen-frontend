import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getRecipe, saveRecipe } from "../../services/recipesService";
import auth from "../../services/authService";
import { toast } from "react-toastify";
import Modal from "../common/modal";
import { getMyIngredients } from "./../../services/ingredientsService";
import {
  Badge,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
  Container,
  Card,
  CardHeader,
  CardBody,
  Row,
  Table,
  Input
} from "reactstrap";
import BlankHeader from "../Headers/BlankHeader";
import Ingredients from "../ingredients/ingredients";
import { withRouter } from "react-router-dom";

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
    ingredientsToAdd: [],
    showModal: false
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

  handleInstructionsDelete = (e, index) => {
    e.preventDefault();
    const instructions = [...this.state.data.instructions];
    instructions.splice(index, 1);
    let data = { ...this.state.data };
    data.instructions = instructions;

    this.setState({ data });
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

  handleUnitChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data.ingredients[parseInt(input.name, 10)].unit = input.value;
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

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    const { user, showModal } = this.state;
    const { ingredients, owner, name, instructions } = this.state.data;
    const { newRecipe } = this.props;
    const canEdit = (user && user._id === owner) || !owner;
    const options = canEdit ? {} : { disabled: true };
    return (
      <div>
        <BlankHeader title={(newRecipe && "Agregar Receta") || name} />
        <Container className="mt--7" fluid>
          <Card className="bg-secondary shadow">
            <CardHeader className="bg-white border-0"></CardHeader>
            <CardBody>
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
                <hr className="my-4" />
                <Row>
                  <h4>
                    Ingredientes
                    {canEdit && (
                      <Badge
                        color="primary"
                        onClick={this.toggleModal}
                        className="mx-2 clickable"
                      >
                        <i className="fa fa-plus"></i>
                      </Badge>
                    )}
                  </h4>
                </Row>
                <Row>
                  <Table size="sm">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Unidad</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredients.map((i, index) => (
                        <tr key={index}>
                          <td className="align-middle">{i.name}</td>
                          <td>
                            <input
                              value={i.amount}
                              onChange={this.handleIngredientChange}
                              name={index}
                              className="form-control"
                            ></input>
                          </td>
                          <td>
                            <Input
                              type="select"
                              value={i.unit}
                              onChange={this.handleUnitChange}
                              name={index}
                            >
                              {i.extraUnits.map(eu => (
                                <option key={eu}>{eu}</option>
                              ))}
                            </Input>
                          </td>
                          <td>
                            <Button
                              color="danger"
                              onClick={() => this.handleIngredientDelete(i)}
                            >
                              <i className="fa fa-times d.-none"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Row>
                <hr className="my-4" />
                <div className="row mx-1">
                  <h4 className="editable">
                    Instrucciones
                    {canEdit && (
                      <Badge
                        color="primary"
                        onClick={this.addInstruction}
                        className="mx-2 clickable"
                      >
                        <i className="fa fa-plus"></i>
                      </Badge>
                    )}
                  </h4>
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
                      <InputGroupAddon addonType="append">
                        <button
                          className="btn btn-danger"
                          onClick={e => this.handleInstructionsDelete(e, index)}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </InputGroupAddon>
                    </InputGroup>
                  ))}
                </div>
                <hr className="my-4" />

                {canEdit && this.renderButton("Guardar")}
              </form>
            </CardBody>
          </Card>
          <Modal
            header="Agregar Ingredientes"
            showModal={showModal}
            toggle={this.toggleModal}
            body={
              <Ingredients
                hasPlusColumn
                onAddedIngredient={this.handleAddedIngredient}
              />
            }
            primaryBtnText={"Cerrar"}
            onPrimaryBtnClick={this.toggleModal}
            size="lg"
          />
        </Container>
      </div>
    );
  }
}

export default withRouter(RecipeForm);
