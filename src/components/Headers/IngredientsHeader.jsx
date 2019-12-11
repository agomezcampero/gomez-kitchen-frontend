/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  Button,
  Input
} from "reactstrap";
import auth from "../../services/authService";
import {
  getIngredients,
  getLiderIngredients
} from "../../services/ingredientsService";
import Modal from "../common/modal";
import IngredientsSearchTable from "../ingredients/ingredientsSearchTable";
import { paginate } from "./../../utils/paginate";
import NewLiderIngredientForm from "../ingredients/newLiderIngredientForm";
import IngredientForm from "./../ingredients/ingredientForm";

class IngredientsHeader extends React.Component {
  state = {
    ingredients: [],
    pageSize: 10,
    currentPage: 1,
    user: auth.getCurrentUser(),
    query: "",
    showTableModal: false,
    showFormModal: false,
    formModalBody: "",
    formModalHeader: "",
    loading: false
  };

  handleQueryChange = ({ currentTarget: input }) => {
    const query = input.value;
    this.setState({ query });
  };

  handleSearch = async () => {
    this.setState({ loading: true, currentPage: 1 });
    this.toggleTableModal();
    const { user, query } = this.state;
    const { data } = await getIngredients(query);
    let ingredients = data.data;
    if (user) {
      ingredients = ingredients.filter(i => !i.followers.includes(user._id));
    }
    this.setState({ ingredients, loading: false });
  };

  handleLiderSearch = async () => {
    this.setState({ loading: true, currentPage: 1 });
    this.toggleTableModal();
    const { query } = this.state;
    const { data } = await getLiderIngredients(query);
    let ingredients = data.data;
    this.setState({ ingredients, loading: false });
  };

  toggleTableModal = () => {
    this.setState({ showTableModal: !this.state.showTableModal });
  };

  toggleFormModal = () => {
    this.setState({ showFormModal: !this.state.showFormModal });
  };

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  handleDelete = ingredient => {
    const ingredients = this.state.ingredients.filter(
      i => i._id !== ingredient._id
    );

    this.setState({ ingredients });
  };

  handleLiderIngredientClick = () => {
    const formModalBody = (
      <NewLiderIngredientForm onIngredientSave={this.props.onIngredientSave} />
    );
    this.setState({
      formModalBody,
      formModalHeader: "Agregar Ingrediente Lider"
    });
    this.toggleFormModal();
  };

  handleNewIngredientClick = () => {
    const formModalBody = (
      <IngredientForm
        onIngredientSave={this.props.onIngredientSave}
        newIngredient
      />
    );
    this.setState({
      formModalBody,
      formModalHeader: "Crear Nuevo Ingrediente"
    });
    this.toggleFormModal();
  };

  render() {
    const {
      query,
      showTableModal,
      showFormModal,
      formModalBody,
      formModalHeader,
      ingredients,
      pageSize,
      currentPage,
      loading
    } = this.state;
    const pagedIngredients = paginate(ingredients, currentPage, pageSize);
    const tableModalBody = loading ? (
      <div className="text-center">
        <i className="fa fa-spinner fa-spin fa-10x"></i>
      </div>
    ) : (
      <IngredientsSearchTable
        ingredients={pagedIngredients}
        itemsCount={ingredients.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={this.handlePageChange}
        onAddedIngredient={this.props.onAddedIngredient}
        onDelete={this.handleDelete}
      />
    );
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>
                <Col lg="6" xl="6">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            BUSCAR INGREDIENTES
                          </CardTitle>
                          <Input
                            value={query}
                            className="h2 font-weight-bold mb-0"
                            onChange={this.handleQueryChange}
                          ></Input>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i className="fas fa-search" />
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-3 mb-0">
                        <Col>
                          <Button
                            color="success"
                            onClick={this.handleSearch}
                            block
                          >
                            Otros Usuarios
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            color="primary"
                            onClick={this.handleLiderSearch}
                            block
                          >
                            Lider
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="6">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            AGREGAR INGREDIENTE
                          </CardTitle>
                          <Input
                            disabled
                            className="h2 font-weight-bold mb-0"
                            style={{
                              border: "none",
                              borderColor: "transparent",
                              backgroundColor: "transparent"
                            }}
                          ></Input>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                            <i className="fas fa-chart-pie" />
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-3 mb-0">
                        <Col>
                          <Button
                            color="success"
                            onClick={this.handleNewIngredientClick}
                            block
                          >
                            Nuevo
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            color="primary"
                            onClick={this.handleLiderIngredientClick}
                            block
                          >
                            Lider
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
        <Modal
          showModal={showTableModal}
          toggle={this.toggleTableModal}
          body={tableModalBody}
          primaryBtnText={"Cerrar"}
          onPrimaryBtnClick={this.toggleTableModal}
          size="lg"
        ></Modal>
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
      </>
    );
  }
}

export default IngredientsHeader;
