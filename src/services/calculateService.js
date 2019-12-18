import http from "./httpService";

const endpoint = "/calculate";

export function generateList(recipes) {
  return http.post(endpoint + "/generateList", { recipes });
}
