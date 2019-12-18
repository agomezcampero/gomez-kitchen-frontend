import http from "./httpService";

const endpoint = "/menus";

function menuUrl(id) {
  return `${endpoint}/${id}`;
}

export function getMyMenus() {
  return http.get(endpoint + "?itemsPerPage=200");
}

export function getMenu(id) {
  return http.get(menuUrl(id));
}

function addRecipe(recipe) {
  return { _id: recipe._id, servings: recipe.servings };
}

export async function saveMenu(menu) {
  const { name } = menu;
  const recipes = await Promise.all(menu.recipes.map(addRecipe));
  const body = { name, recipes };

  if (!menu._id) return http.post(endpoint, body);

  return http.put(menuUrl(menu._id), body);
}
