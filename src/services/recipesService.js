import http from "./httpService";

const endpoint = "/recipes";

function recipeUrl(id) {
  return `${endpoint}/${id}`;
}

export function getMyRecipes() {
  return http.get(endpoint + "/following/me?itemsPerPage=200");
}

export function getRecipes(query) {
  return http.get(
    endpoint + `?search=${query.replace(/ /g, "+")}&itemsPerPage=50`
  );
}

export function deleteRecipe(id) {
  return http.delete(recipeUrl(id));
}

export function followRecipe(id) {
  return http.put(recipeUrl(id) + "/follow");
}

export function getRecipe(id) {
  return http.get(recipeUrl(id));
}

export function saveRecipe(recipe) {
  const { name, ingredients, instructions, prepTime, servings } = recipe;
  let ingredientsToSave = [];
  ingredients.forEach(i => {
    const { _id, unit, amount } = i;
    ingredientsToSave.push({ _id, unit, amount });
  });
  const body = {
    name,
    ingredients: ingredientsToSave,
    instructions,
    prepTime,
    servings
  };

  if (!recipe._id) return http.post(endpoint, body);

  return http.put(recipeUrl(recipe._id), body);
}

export function refreshRecipe(id) {
  return http.put(recipeUrl(id) + "/refresh");
}
