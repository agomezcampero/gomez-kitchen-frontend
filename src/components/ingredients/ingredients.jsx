import React, { Component } from "react";
import _ from "lodash";
import IngredientsTable from "./ingredientsTable";
import Pagination from "./../common/pagination";
import SearchBox from "./../common/searchBox";
import {
  getMyIngredients,
  deleteIngredient,
  refreshIngredient
} from "./../../services/ingredientsService";
import { paginate } from "./../../utils/paginate";
import auth from "../../services/authService";
import { toast } from "react-toastify";
import NewLiderIngredientForm from "./newLiderIngredientForm";
import IngredientForm from "./ingredientForm";
import DeleteModal from "../common/deleteModal";
import IngredientSearch from "./ingredientSearch";

class Ingredients extends Component {
  state = {
    ingredients: [],
    pageSize: 25,
    currentPage: 1,
    sortColumn: { path: "name", order: "asc" },
    searchQuery: "",
    user: auth.getCurrentUser(),
    deleteModal: {
      showModal: false,
      item: {}
    }
  };

  async componentDidMount() {
    const { data } = await getMyIngredients();

    this.setState({
      ingredients: data.data
    });
  }

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  handleSort = sortColumn => {
    this.setState({
      sortColumn
    });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleDelete = async ingredient => {
    const { user, ingredients: originalIngredients } = this.state;
    let ingredients = originalIngredients.filter(i => i._id !== ingredient._id);

    this.setState({ ingredients });

    if (!user || !ingredient.followers.includes(user._id)) return;

    try {
      await deleteIngredient(ingredient._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Error deleting ingredient, please refresh page");
      this.setState({ ingredients: originalIngredients });
    }
  };

  handleRefresh = async ingredient => {
    try {
      await refreshIngredient(ingredient._id);
      toast.success(`${ingredient.name} actualizado!`);
      const { data } = await getMyIngredients();
      this.setState({ ingredients: data.data });
    } catch (ex) {
      toast.error("Hubo un error actualizando este ingrediente");
    }
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      ingredients: allIngredients
    } = this.state;

    const filtered = searchQuery ? this.getSearchData() : allIngredients;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const ingredients = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: ingredients };
  };

  getSearchData = () => {
    const { ingredients: allIngredients, searchQuery } = this.state;

    var re = new RegExp(searchQuery.replace(/\\/g, ""), "g");
    return allIngredients.filter(i => i.name.toLowerCase().match(re));
  };

  toggleDeleteModal = item => {
    this.setState({
      deleteModal: { showModal: !this.state.deleteModal.showModal, item }
    });
  };

  addIngredientToTable = async ingredient => {
    const ingredients = [...this.state.ingredients];
    ingredients.push(ingredient);
    this.setState({ ingredients });
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    const {
      showModal: showDeleteModal,
      item: deleteModalItem
    } = this.state.deleteModal;

    const { totalCount, data: ingredients } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-md-8 col-sm-12">
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
            placeholder="Buscar en mis ingredientes..."
          />
          <DeleteModal
            showModal={showDeleteModal}
            toggle={this.toggleDeleteModal}
            onPrimaryBtnClick={this.handleDelete}
            onSecondaryBtnClick={this.toggleDeleteModal}
            item={deleteModalItem}
          />
          <IngredientsTable
            ingredients={ingredients}
            onSort={this.handleSort}
            onRefresh={this.handleRefresh}
            onDelete={this.toggleDeleteModal}
            sortColumn={sortColumn}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
        <div className="col-md-4 col-sm-12">
          <IngredientSearch onAddedIngredient={this.addIngredientToTable} />
          <NewLiderIngredientForm
            onIngredientSave={this.addIngredientToTable}
          />
          <IngredientForm
            newIngredient={true}
            onIngredientSave={this.addIngredientToTable}
          />
        </div>
      </div>
    );
  }
}

export default Ingredients;
