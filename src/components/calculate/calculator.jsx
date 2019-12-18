import React, { Component } from "react";
import {
  Container,
  Button,
  Badge,
  Label,
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import AddRecipesTable from "./addRecipesTable";
import { getMyRecipes } from "./../../services/recipesService";
import CaluculatorHeader from "../Headers/CalculatorHeader";
import Modal from "../common/modal";
import { paginate } from "./../../utils/paginate";
import { generateList as dbGenerateList } from "./../../services/calculateService";
import CopyModal from "./../common/copyModal";

class Calculator extends Component {
  state = {
    recipes: [],
    price: 0,
    showModal: false,
    showListModal: false,
    listIngredients: [],
    listIngredientsText: "",
    listIngredientsCopied: false,
    recipesToAdd: [],
    pageSize: 10,
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

  toggleListModal = () => {
    this.setState({ showListModal: !this.state.showListModal });
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

  generateList = async () => {
    const { data: ingredients } = await dbGenerateList(this.state.recipes);
    const ingredientsText = ingredients
      .map(ing => [`${ing.name} | ${ing.amount} ${ing.unit}`])
      .join("\n");
    this.setState({
      listIngredients: ingredients,
      listIngredientsText: ingredientsText,
      listIngredientsCopied: false
    });
    this.toggleListModal();
  };

  render() {
    const {
      recipesToAdd,
      recipes,
      showModal,
      showListModal,
      listIngredients,
      listIngredientsText,
      listIngredientsCopied,
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
              <Button color="primary" onClick={this.generateList}>
                Generar Lista
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
              <CopyModal
                header="Lista"
                showModal={showListModal}
                toggle={this.toggleListModal}
                body={
                  <ListGroup>
                    {listIngredients.map((i, index) => (
                      <ListGroupItem
                        key={index}
                        className="justify-content-between"
                      >
                        {i.name}{" "}
                        <Badge className="ml-2" color="primary">
                          {i.amount} {i.unit}
                        </Badge>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                }
                primaryBtnText="Copiar"
                secondaryBtnText="Cerrar"
                onSecondaryBtnClick={this.toggleListModal}
                size="lg"
                copyText={listIngredientsText}
                copied={listIngredientsCopied}
                onCopy={() => this.setState({ listIngredientsCopied: true })}
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
