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
import Ingredients from "./../components/ingredients/ingredients";
import Recipes from "./../components/recipes/recipes";
import Recipe from "./../components/recipes/recipe";
import Calculator from "./../components/calculate/calculator";
import RecipeForm from "./../components/recipes/recipeForm";

var routes = [
  {
    path: "/ingredients",
    name: "Ingredientes",
    icon: "ni ni-tv-2 text-primary",
    component: Ingredients,
    layout: "/user"
  },
  {
    path: "/recipes/new",
    name: "Recetas",
    component: RecipeForm,
    layout: "/user",
    props: { newRecipe: true }
  },
  {
    path: "/recipes/:id/edit",
    name: "Recetas",
    component: RecipeForm,
    layout: "/user"
  },
  {
    path: "/recipes/:id",
    name: "Recetas",
    component: Recipe,
    layout: "/user"
  },
  {
    path: "/recipes",
    name: "Recetas",
    icon: "ni ni-planet text-blue",
    component: Recipes,
    layout: "/user"
  },
  {
    path: "/calculator",
    name: "Calcular",
    icon: "ni ni-pin-3 text-orange",
    component: Calculator,
    layout: "/user"
  }
];

export default routes;
