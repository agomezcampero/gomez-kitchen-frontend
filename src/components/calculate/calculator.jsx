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
  ListGroupItem,
  Input,
  InputGroupAddon,
  Form,
  InputGroup
} from "reactstrap";
import AddRecipesTable from "./addRecipesTable";
import { getMyRecipes } from "./../../services/recipesService";
import CaluculatorHeader from "../Headers/CalculatorHeader";
import Modal from "../common/modal";
import { paginate } from "./../../utils/paginate";
import { generateList as dbGenerateList } from "./../../services/calculateService";
import CopyModal from "./../common/copyModal";
import AddMenusTable from "./addMenusTable";
import {
  getMyMenus,
  getMenu,
  saveMenu as saveMenuInDb
} from "./../../services/menusService";
import { toast } from "react-toastify";

class Calculator extends Component {
  state = {
    recipes: [],
    price: 0,
    showModal: false,
    selectedModal: "",
    showListModal: false,
    listIngredients: [],
    listIngredientsText: "",
    listIngredientsCopied: false,
    recipesToAdd: [],
    menusToAdd: [],
    pageSize: 10,
    currentPage: 1,
    searchQuery: "",
    name: ""
  };

  async componentDidMount() {
    const { data: recipes } = await getMyRecipes();
    const { data: menus } = await getMyMenus();

    this.setState({
      recipesToAdd: recipes.data,
      menusToAdd: menus.data
    });
  }

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  getPagedData = items => {
    const { pageSize, currentPage, searchQuery } = this.state;

    const filtered = searchQuery ? this.getSearchData(items) : items;

    return paginate(filtered, currentPage, pageSize);
  };

  getSearchData = items => {
    const { searchQuery } = this.state;

    var re = new RegExp(searchQuery.replace(/\\/g, ""), "g");
    return items.filter(item => item.name.toLowerCase().match(re));
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  openModal = selected => {
    this.setState({ selectedModal: selected });
    this.toggleModal();
  };

  getModalBody = () => {
    const { selectedModal, pageSize, currentPage, searchQuery } = this.state;
    if (selectedModal === "recipes") {
      const { recipesToAdd } = this.state;
      const pagedRecipes = this.getPagedData(recipesToAdd);
      return (
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
      );
    } else if (selectedModal === "menus") {
      const { menusToAdd } = this.state;
      const pagedMenus = this.getPagedData(menusToAdd);
      return (
        <AddMenusTable
          menus={pagedMenus}
          onAddedMenu={this.handleAddedMenu}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
          itemsCount={menusToAdd.length}
          searchValue={searchQuery}
          onSearchChange={this.handleSearch}
        />
      );
    }
  };

  toggleListModal = () => {
    this.setState({ showListModal: !this.state.showListModal });
  };

  handleAddedRecipe = recipe => {
    let recipes = [...this.state.recipes];
    recipes.push({ ...recipe });

    this.setState({ recipes });
    this.setPrice(recipes);
  };

  handleAddedMenu = async id => {
    const { data: menu } = await getMenu(id);
    let recipes = [...this.state.recipes, ...menu.recipes];
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

  handleNameChange = ({ currentTarget: input }) => {
    this.setState({ name: input.value });
  };

  saveMenu = async e => {
    e.preventDefault();
    try {
      const menu = { name: this.state.name, recipes: this.state.recipes };
      await saveMenuInDb(menu);
      toast.success("Menú guardado");
    } catch (ex) {
      toast.error("No se pudo guardar el menú");
    }
  };

  render() {
    const {
      recipes,
      showModal,
      showListModal,
      listIngredients,
      listIngredientsText,
      listIngredientsCopied
    } = this.state;

    const modalBody = showModal ? this.getModalBody() : "";

    return (
      <div>
        <CaluculatorHeader price={this.state.price} />
        <Container className="mt--7" fluid>
          <Card className="bg-secondary shadow">
            <CardHeader className="bg-white border-0">
              <Form inline>
                <Button
                  color="success"
                  onClick={() => this.openModal("recipes")}
                >
                  Agregar Receta
                </Button>
                <Button color="default" onClick={() => this.openModal("menus")}>
                  Agregar Menú
                </Button>
                <Button color="primary" onClick={this.generateList}>
                  Generar Lista
                </Button>
                <InputGroup className="col-4 ml-auto">
                  <Input
                    placeholder="Nombre"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                  />
                  <InputGroupAddon addonType="append">
                    <Button color="info" onClick={this.saveMenu}>
                      Guardar
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Form>
            </CardHeader>
            <CardBody>
              <Modal
                header="Agregar Recetas"
                showModal={showModal}
                toggle={this.toggleModal}
                body={modalBody}
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
