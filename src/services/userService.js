import http from "./httpService";

const usersEndpoint = "/users";

export function register(user) {
  return http.post(usersEndpoint, user);
}
