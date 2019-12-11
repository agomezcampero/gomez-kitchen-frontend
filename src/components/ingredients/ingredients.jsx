import React, { Component } from "react";
import _ from "lodash";
import IngredientsTable from "./ingredientsTable";
import {
  getMyIngredients,
  deleteIngredient,
  refreshIngredient
} from "./../../services/ingredientsService";
import { paginate } from "./../../utils/paginate";
import auth from "../../services/authService";
import { toast } from "react-toastify";
import IngredientForm from "./ingredientForm";
import DeleteModal from "../common/deleteModal";
import IngredientsHeader from "../Headers/IngredientsHeader";
import { Container } from "reactstrap";
import Modal from "./../common/modal";

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
    },
    formModal: {
      showModal: false,
      header: "",
      body: ""
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

    if (!user) return;

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

  handleIngredientUpdate = ingredient => {
    const { ingredients: originalIngredients } = this.state;
    let ingredients = originalIngredients.filter(i => i._id !== ingredient._id);
    ingredients.push(ingredient);

    this.setState({ ingredients });
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

  toggleFormModal = item => {
    const { showModal } = this.state.formModal;
    if (!item || showModal)
      return this.setState({ formModal: { showModal: false } });

    const header = item.name;
    const body = (
      <IngredientForm
        ingredient={item}
        onIngredientSave={this.handleIngredientUpdate}
      />
    );
    this.setState({
      formModal: {
        showModal: true,
        header,
        body
      }
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

    const {
      showModal: showFormModal,
      header: formModalHeader,
      body: formModalBody
    } = this.state.formModal;

    const { hasPlusColumn, onAddedIngredient } = this.props;

    const { totalCount, data: ingredients } = this.getPagedData();

    return (
      <React.Fragment>
        <IngredientsHeader
          onAddedIngredient={this.addIngredientToTable}
          onIngredientSave={this.addIngredientToTable}
        />
        <Container className="mt--7" fluid>
          <DeleteModal
            showModal={showDeleteModal}
            toggle={this.toggleDeleteModal}
            onPrimaryBtnClick={this.handleDelete}
            onSecondaryBtnClick={this.toggleDeleteModal}
            item={deleteModalItem}
          />
          <Modal
            header={formModalHeader}
            showModal={showFormModal}
            toggle={this.toggleFormModal}
            body={formModalBody}
            primaryBtnText={"Guardar"}
            form="ingredient-form"
            secondaryBtnText={"Cerrar"}
            onSecondaryBtnClick={this.toggleFormModal}
            size="lg"
          ></Modal>
          <IngredientsTable
            ingredients={ingredients}
            onSort={this.handleSort}
            onRefresh={this.handleRefresh}
            onDelete={this.toggleDeleteModal}
            sortColumn={sortColumn}
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
            searchValue={searchQuery}
            onSearchChange={this.handleSearch}
            onItemClick={this.toggleFormModal}
            hasPlusColumn={hasPlusColumn}
            onAddedIngredient={onAddedIngredient}
          />
        </Container>
      </React.Fragment>
    );
  }
}

export default Ingredients;
