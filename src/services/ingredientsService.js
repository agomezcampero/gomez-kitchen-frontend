import http from "./httpService";

const endpoint = "/ingredients";

function ingredientUrl(id) {
  return `${endpoint}/${id}`;
}

export function getMyIngredients() {
  return http.get(endpoint + "/following/me");
}

export function getIngredients(query) {
  return http.get(endpoint + `?search=${query.replace(/ /g, "+")}`);
}

export function deleteIngredient(id) {
  return http.delete(ingredientUrl(id));
}

export function followIngredient(id) {
  return http.put(ingredientUrl(id) + "/follow");
}

export function getIngredient(id) {
  return http.get(ingredientUrl(id));
}

export function saveIngredient(ingredient) {
  const { name, price, unit, amount, liderId } = ingredient;
  const body = { name, price, unit, amount, liderId };

  if (!ingredient._id) return http.post(endpoint, body);

  return http.put(ingredientUrl(ingredient._id), body);
}

export function saveLiderIngredient(liderId) {
  return http.post(endpoint + "/lider", { liderId });
}

export function refreshIngredient(id) {
  return http.put(ingredientUrl(id) + "/refresh");
}