import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import {
  getIngredient,
  saveIngredient
} from "../../services/ingredientsService";
import auth from "../../services/authService";
import { toast } from "react-toastify";
import { Row, Col, Badge, Button } from "reactstrap";
import Delete from "./../common/delete";

class IngredientForm extends Form {
  state = {
    data: {
      name: "",
      price: "",
      unit: "",
      amount: "",
      extraUnits: [],
      liderId: "",
      followers: [],
      owner: ""
    },
    errors: {},
    user: auth.getCurrentUser()
  };

  arraySchemas = {
    extraUnits: Joi.object().keys({
      unit: Joi.string()
        .required()
        .label("Unidad"),
      amount: Joi.number()
        .required()
        .min(0)
        .label("Cantidad"),
      _id: Joi.string()
    })
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Nombre"),
    price: Joi.number()
      .required()
      .label("Precio"),
    unit: Joi.string()
      .required()
      .label("Unidad"),
    amount: Joi.number()
      .required()
      .min(0)
      .label("Cantidad"),
    extraUnits: Joi.array().items(this.arraySchemas.extraUnits),
    liderId: Joi.string().allow(""),
    followers: Joi.array().allow([]),
    owner: Joi.string()
      .allow("")
      .allow(null)
  };

  async componentDidMount() {
    const { newIngredient, ingredient } = this.props;
    if (newIngredient) return;

    if (ingredient)
      return this.setState({ data: this.mapToViewModel(ingredient) });

    const id = this.props.match.params.id;
    if (!id) return;
    await this.populateIngredient(id);
  }

  async populateIngredient(id) {
    try {
      const { data: ingredient } = await getIngredient(id);
      this.setState({ data: this.mapToViewModel(ingredient) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  mapToViewModel(ingredient) {
    return {
      _id: ingredient._id,
      name: ingredient.name,
      price: ingredient.price,
      unit: ingredient.unit,
      amount: ingredient.amount,
      extraUnits: ingredient.extraUnits,
      liderId: ingredient.liderId,
      followers: ingredient.followers,
      owner: ingredient.owner
    };
  }

  doSubmit = async () => {
    try {
      const { data: ingredient } = await saveIngredient(this.state.data);
      toast.success(
        `Ingrediente guardado\n${ingredient.name}\n$${ingredient.price} ${ingredient.amount} ${ingredient.unit}`
      );
      this.props.onIngredientSave(ingredient);
    } catch (ex) {
      toast.error("No se pudo guardar el ingrediente");
    }
  };

  addExtraUnit = () => {
    let data = { ...this.state.data };
    let extraUnits = [...data.extraUnits];
    extraUnits.push({ unit: "", amount: "" });
    data.extraUnits = extraUnits;
    this.setState({ data });
  };

  deleteExtraUnit = i => {
    let data = { ...this.state.data };
    let extraUnits = [
      ...data.extraUnits.slice(0, i),
      ...data.extraUnits.slice(i + 1)
    ];
    data.extraUnits = extraUnits;
    this.setState({ data });
  };

  render() {
    const { user } = this.state;
    const { owner, extraUnits } = this.state.data;
    const canEdit = (user && user._id === owner) || !owner;
    const options = canEdit ? {} : { disabled: true };
    return (
      <div>
        <form id="ingredient-form" onSubmit={this.handleSubmit}>
          <Row>
            <Col>{this.renderInput("name", "Nombre", options)}</Col>
            <Col>{this.renderInput("price", "Precio", options)}</Col>
          </Row>
          <Row>
            <Col>{this.renderInput("amount", "Cantidad", options)}</Col>
            <Col>{this.renderInput("unit", "Unidad", options)}</Col>
            <Col>{this.renderInput("liderId", "ID Lider", options)}</Col>
          </Row>
          <Row>
            <h4 className="editable">
              Más Unidades
              {canEdit && (
                <Badge
                  color="primary"
                  className="mx-2 clickable"
                  onClick={this.addExtraUnit}
                >
                  <i className="fa fa-plus"></i>
                </Badge>
              )}
            </h4>
          </Row>
          {extraUnits.map((extra, i) => (
            <Row key={i}>
              <Col>
                {this.renderInput(
                  `extraUnits.${i}.amount`,
                  "Cantidad",
                  options
                )}
              </Col>
              <Col>
                {this.renderInput(`extraUnits.${i}.unit`, "Unidad", options)}
              </Col>
              <Button
                color="danger"
                className="my-4"
                onClick={() => this.deleteExtraUnit(i)}
              >
                <Delete></Delete>
              </Button>
            </Row>
          ))}
        </form>
      </div>
    );
  }
}

export default IngredientForm;
