import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import logo from "./logo.svg";
import "./App.css";
import GomezNavbar from "./components/gomezNavbar";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import RegisterForm from "./components/registerForm";
import Ingredients from "./components/ingredients/ingredients";
import IngredientForm from "./components/ingredients/ingredientForm";
import Recipes from "./components/recipes/recipes";
import Recipe from "./components/recipes/recipe";
import RecipeForm from "./components/recipes/recipeForm";
import Calculator from "./components/calculate/calculator";
import ProtectedRoute from "./components/common/protectedRoute";

function App() {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    console.log("dev");
  } else {
    console.log("prod");
  }
  return (
    <React.Fragment>
      <ToastContainer />
      <GomezNavbar />
      <main className="container">
        <div className="content">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <ProtectedRoute path="/logout" component={Logout} />
            <ProtectedRoute
              path="/ingredients/:id"
              component={IngredientForm}
            />
            <ProtectedRoute path="/ingredients" component={Ingredients} />
            <ProtectedRoute path="/recipes/new" component={RecipeForm} />
            <ProtectedRoute path="/recipes/:id/edit" component={RecipeForm} />
            <ProtectedRoute path="/recipes/:id" component={Recipe} />
            <ProtectedRoute path="/recipes" component={Recipes} />
            <ProtectedRoute path="/calculate" component={Calculator} />
            <Redirect from="/" to="/recipes" exact />
            <Redirect to="not-found" />
          </Switch>
        </div>
      </main>
    </React.Fragment>
  );
}

export default App;
