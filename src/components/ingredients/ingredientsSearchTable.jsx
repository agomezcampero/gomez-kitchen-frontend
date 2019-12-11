import React, { Component } from "react";
import Table from "../common/table";
import Plus from "../common/plus";
import {
  followIngredient,
  saveLiderIngredient
} from "../../services/ingredientsService";
import { toast } from "react-toastify";

class IngredientsSearchTable extends Component {
  columns = [
    {
      key: "plus",
      label: "",
      content: ingredient => (
        <Plus onClick={() => this.addIngredient(ingredient)} />
      )
    },
    {
      label: "Nombre",
      path: "name"
    },
    { path: "price", label: "Precio" },
    {
      path: "amount&unit",
      label: "Cantidad",
      content: ingredient => `${ingredient.amount} ${ingredient.unit}`
    },
    {
      path: "liderId",
      label: "Lider",
      content: ingredient =>
        ingredient.liderId && <i className="fa fa-check"></i>
    }
  ];

  async addIngredient(ingredient) {
    try {
      if (!ingredient._id) {
        const data = await saveLiderIngredient(ingredient.liderId);
        ingredient = data.data;
      } else {
        await followIngredient(ingredient._id);
      }
      this.props.onAddedIngredient(ingredient);
      this.props.onDelete(ingredient);
      toast.success(`${ingredient.name} agregado`);
    } catch (ex) {
      toast.error("Error agregando ingrediente, volver a intentar");
    }
  }

  render() {
    const { ingredients, ...rest } = this.props;

    if (!ingredients.length)
      return <h2>No se encontraron ingredientes, pruebe otra búsqueda</h2>;

    return (
      <Table
        title="Resultados"
        data={ingredients}
        columns={this.columns}
        sortable={false}
        {...rest}
      />
    );
  }
}

export default IngredientsSearchTable;
