import { api } from "boot/axios";

export function setState(state, { prop, val }) {
  state[prop] = val;
}

export function authSuccess(state, { token, payload }) {
  localStorage.setItem("token", "Bearer " + token);
  api.defaults.headers.common["Authorization"] = localStorage.getItem("token");
  state.token = token;
  state.localUser = payload;
}

export function logout(state) {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
  state.token = "";
  if (this.$router.currentRoute.name !== "Authorization") {
    this.$router.push({ name: "Authorization" });
  }
}
