import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveLiderIngredient } from "../../services/ingredientsService";
import auth from "../../services/authService";
import { toast } from "react-toastify";

class NewLiderIngredientForm extends Form {
  state = {
    data: { liderId: "" },
    errors: {},
    user: auth.getCurrentUser()
  };

  schema = {
    liderId: Joi.string()
  };

  doSubmit = async () => {
    try {
      const { data: ingredient } = await saveLiderIngredient(
        this.state.data.liderId
      );
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
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("liderId", "ID Lider")}
          {user && this.renderButton("Guardar")}
        </form>
      </div>
    );
  }
}

export default NewLiderIngredientForm;
