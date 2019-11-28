import React, { Component } from "react";
import _ from "lodash";
import RecipesTable from "./recipesTable";
import Pagination from "./../common/pagination";
import SearchBox from "./../common/searchBox";
import {
  getMyRecipes,
  deleteRecipe,
  refreshRecipe
} from "./../../services/recipesService";
import { paginate } from "./../../utils/paginate";
import auth from "../../services/authService";
import { toast } from "react-toastify";
import DeleteModal from "../common/deleteModal";
import RecipeSearch from "./recipeSearch";

class Recipes extends Component {
  state = {
    recipes: [],
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
    const { data } = await getMyRecipes();

    this.setState({
      recipes: data.data
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

  handleDelete = async recipe => {
    const { user, recipes: originalRecipes } = this.state;
    let recipes = originalRecipes.filter(r => r._id !== recipe._id);

    this.setState({ recipes });

    if (!user || !recipe.followers.includes(user._id)) return;

    try {
      await deleteRecipe(recipe._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Error deleting recipe, please refresh page");
      this.setState({ recipes: originalRecipes });
    }
  };

  handleRefresh = async recipe => {
    try {
      await refreshRecipe(recipe._id);
      toast.success(`${recipe.name} actualizado!`);
      const { data } = await getMyRecipes();
      this.setState({ recipes: data.data });
    } catch (ex) {
      toast.error("Hubo un error actualizando esta receta");
    }
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      recipes: allRecipes
    } = this.state;

    const filtered = searchQuery ? this.getSearchData() : allRecipes;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const recipes = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: recipes };
  };

  getSearchData = () => {
    const { recipes: allRecipes, searchQuery } = this.state;

    var re = new RegExp(searchQuery.replace(/\\/g, ""), "g");
    return allRecipes.filter(r => r.name.toLowerCase().match(re));
  };

  toggleDeleteModal = item => {
    this.setState({
      deleteModal: { showModal: !this.state.deleteModal.showModal, item }
    });
  };

  addRecipeToTable = recipe => {
    const recipes = [...this.state.recipes];
    recipes.push(recipe);
    this.setState({ recipes });
  };

  handleNewRecipeClick = () => {
    this.props.history.push("/recipes/new");
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    const {
      showModal: showDeleteModal,
      item: deleteModalItem
    } = this.state.deleteModal;

    const { totalCount, data: recipes } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-md-8 col-sm-12">
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
            placeholder="Buscar en mis recetas..."
          />
          <DeleteModal
            showModal={showDeleteModal}
            toggle={this.toggleDeleteModal}
            onPrimaryBtnClick={this.handleDelete}
            onSecondaryBtnClick={this.toggleDeleteModal}
            item={deleteModalItem}
          />
          <RecipesTable
            recipes={recipes}
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
          <RecipeSearch
            onAddedRecipe={this.addRecipeToTable}
            onNewRecipe={this.handleNewRecipeClick}
          />
        </div>
      </div>
    );
  }
}

export default Recipes;
