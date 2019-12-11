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
import { getRecipes } from "../../services/recipesService";
import Modal from "../common/modal";
import RecipesSearchTable from "../recipes/recipesSearchTable";
import { paginate } from "./../../utils/paginate";
import { withRouter } from "react-router-dom";

class RecipesHeader extends React.Component {
  state = {
    recipes: [],
    pageSize: 10,
    currentPage: 1,
    user: auth.getCurrentUser(),
    query: "",
    showTableModal: false,
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
    const { data } = await getRecipes(query);
    let recipes = data.data;
    if (user) {
      recipes = recipes.filter(r => !r.followers.includes(user._id));
    }
    this.setState({ recipes, loading: false });
  };

  toggleTableModal = () => {
    this.setState({ showTableModal: !this.state.showTableModal });
  };

  handlePageChange = page => {
    this.setState({
      currentPage: page
    });
  };

  handleDelete = recipe => {
    const recipes = this.state.recipes.filter(r => r._id !== recipe._id);

    this.setState({ recipes });
  };

  handleNewIngredientClick = () => {
    this.props.history.push("/user/recipes/new");
  };

  render() {
    const {
      query,
      showTableModal,
      recipes,
      pageSize,
      currentPage,
      loading
    } = this.state;
    const pagedRecipes = paginate(recipes, currentPage, pageSize);
    const tableModalBody = loading ? (
      <div className="text-center">
        <i className="fa fa-spinner fa-spin fa-10x"></i>
      </div>
    ) : (
      <RecipesSearchTable
        recipes={pagedRecipes}
        itemsCount={recipes.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={this.handlePageChange}
        onAddedRecipe={this.props.onAddedRecipe}
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
                            BUSCAR RECETAS
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
                            AGREGAR RECETA
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
                            color="primary"
                            onClick={this.handleNewIngredientClick}
                            block
                          >
                            Nueva
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
      </>
    );
  }
}

export default withRouter(RecipesHeader);
