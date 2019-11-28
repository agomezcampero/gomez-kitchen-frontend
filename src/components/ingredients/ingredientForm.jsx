import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import {
  getIngredient,
  saveIngredient
} from "../../services/ingredientsService";
import auth from "../../services/authService";
import { toast } from "react-toastify";

class IngredientForm extends Form {
  state = {
    data: {
      name: "",
      price: "",
      unit: "",
      amount: "",
      liderId: "",
      followers: [],
      owner: ""
    },
    errors: {},
    user: auth.getCurrentUser()
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
      .min(0),
    liderId: Joi.string().allow(""),
    followers: Joi.array().allow([]),
    owner: Joi.string()
      .allow("")
      .allow(null)
  };

  async componentDidMount() {
    const newIngredient = this.props.newIngredient;
    if (newIngredient) return;

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

  render() {
    const { user } = this.state;
    const { owner, name } = this.state.data;
    const { newIngredient } = this.props;
    const options =
      (user && user._id === owner) || !owner ? {} : { disabled: true };
    return (
      <div>
        <h4 className="mt-2">
          {(newIngredient && "Agregar Ingrediente") || name}
        </h4>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Nombre", options)}
          {this.renderInput("price", "Precio", options)}
          {this.renderInput("amount", "Cantidad", options)}
          {this.renderInput("unit", "Unidad", options)}
          {!newIngredient && this.renderInput("liderId", "ID Lider", options)}
          {user &&
            (user._id === owner || !owner) &&
            this.renderButton("Guardar")}
        </form>
      </div>
    );
  }
}

export default IngredientForm;
