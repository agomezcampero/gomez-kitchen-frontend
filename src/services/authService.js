import http from "./httpService";
import jwtDecode from "jwt-decode";

const authEndpoint = "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(email, password) {
  const { data: body } = await http.post(authEndpoint, { email, password });
  localStorage.setItem(tokenKey, body[tokenKey]);
}

export function loginWithRegister(response) {
  localStorage.setItem(tokenKey, response.data[tokenKey]);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {}
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithRegister,
  logout,
  getCurrentUser
};
