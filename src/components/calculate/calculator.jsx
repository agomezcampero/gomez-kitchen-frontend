import React, { Component } from "react";
import {
  Container,
  Button,
  Label,
  Card,
  CardBody,
  CardHeader
} from "reactstrap";
import AddRecipesTable from "./addRecipesTable";
import { getMyRecipes } from "./../../services/recipesService";
import CaluculatorHeader from "../Headers/CalculatorHeader";
import Modal from "../common/modal";
import { paginate } from "./../../utils/paginate";

class Calculator extends Component {
  state = {
    recipes: [],
    price: 0,
    showModal: false,
    recipesToAdd: [],
    pageSize: 3,
    currentPage: 1,
    searchQuery: ""
  };

  async componentDidMount() {
    const { data } = await getMyRecipes();

    this.setState({
      recipesToAdd: data.data
    });
  }

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  getPagedData = () => {
    const { pageSize, currentPage, recipesToAdd, searchQuery } = this.state;

    const filtered = searchQuery ? this.getSearchData() : recipesToAdd;

    return paginate(filtered, currentPage, pageSize);
  };

  getSearchData = () => {
    const { recipesToAdd, searchQuery } = this.state;

    var re = new RegExp(searchQuery.replace(/\\/g, ""), "g");
    return recipesToAdd.filter(r => r.name.toLowerCase().match(re));
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  handleAddedRecipe = recipe => {
    let recipes = [...this.state.recipes];
    recipe.pricePerServing = recipe.price / recipe.servings;
    recipes.push({ ...recipe });

    this.setState({ recipes });
    this.setPrice(recipes);
  };

  getTotalPrice = (accumulator, currentValue) =>
    accumulator + currentValue.price;

  handleServingsChange = ({ currentTarget: input }) => {
    const recipes = [...this.state.recipes];
    const recipe = recipes[parseInt(input.name, 10)];
    recipe.servings = input.value;
    recipe.price = recipe.pricePerServing * recipe.servings;
    this.setState({ recipes });
    this.setPrice(recipes);
  };

  setPrice = recipes => {
    const price = recipes.reduce(this.getTotalPrice, 0);
    this.setState({ price });
  };

  render() {
    const {
      recipesToAdd,
      recipes,
      showModal,
      pageSize,
      currentPage,
      searchQuery
    } = this.state;

    const pagedRecipes = this.getPagedData();
    return (
      <div>
        <CaluculatorHeader price={this.state.price} />
        <Container className="mt--7" fluid>
          <Card className="bg-secondary shadow">
            <CardHeader className="bg-white border-0">
              <Button color="success" onClick={this.toggleModal}>
                Agregar Receta
              </Button>
            </CardHeader>
            <CardBody>
              <Modal
                header="Agregar Recetas"
                showModal={showModal}
                toggle={this.toggleModal}
                body={
                  <AddRecipesTable
                    recipes={pagedRecipes}
                    onAddedRecipe={this.handleAddedRecipe}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange}
                    itemsCount={recipesToAdd.length}
                    searchValue={searchQuery}
                    onSearchChange={this.handleSearch}
                  />
                }
                primaryBtnText={"Cerrar"}
                onPrimaryBtnClick={this.toggleModal}
                size="lg"
              />
              <h4 className="row my-2">
                <Label className="col">Nombre</Label>
                <Label className="col">Precio</Label>
                <Label className="col">Porciones</Label>
              </h4>
              {recipes.map((r, index) => (
                <div className="row" key={index}>
                  <hr className="w-100" />
                  <Label className="col">{r.name}</Label>
                  <Label className="col">${r.price}</Label>
                  <input
                    name={index}
                    className="col form-control"
                    value={r.servings}
                    onChange={this.handleServingsChange}
                  ></input>
                </div>
              ))}
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}

export default Calculator;
