import React, { Component } from "react";
import Table from "../common/table";
import Plus from "../common/plus";
import { followIngredient } from "../../services/ingredientsService";
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
      await followIngredient(ingredient._id);
      this.props.onAddedIngredient(ingredient);
      this.props.onDelete(ingredient);
    } catch (ex) {
      toast.error("Error agregando ingrediente, volver a intentar");
    }
  }

  render() {
    const { ingredients } = this.props;

    if (!ingredients.length) return null;

    return <Table data={ingredients} columns={this.columns} sortable={false} />;
  }
}

export default IngredientsSearchTable;
