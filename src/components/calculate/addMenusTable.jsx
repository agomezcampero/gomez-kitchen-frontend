import React, { Component } from "react";
import Table from "../common/table";
import Plus from "../common/plus";

class AddMenusTable extends Component {
  columns = [
    {
      key: "plus",
      label: "",
      content: menu => <Plus onClick={() => this.props.onAddedMenu(menu._id)} />
    },
    {
      label: "Nombre",
      path: "name"
    },
    {
      label: "Recetas",
      key: "recipes",
      content: menu => menu.recipes.length
    }
  ];

  render() {
    const { menus, ...rest } = this.props;

    return (
      <Table data={menus} columns={this.columns} sortable={false} {...rest} />
    );
  }
}

export default AddMenusTable;
