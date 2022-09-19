import { api } from "boot/axios";

export function setState(state, { prop, val }) {
  state[prop] = val;
}

export function authSuccess(state, { token, payload }) {
  localStorage.setItem("token", "Bearer " + token);
  api.defaults.headers.common["Authorization"] = localStorage.getItem("token");
  state.token = token;
  state.localUser = payload;
  state.username = null;
  state.password = null;
}

export function logout(state) {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
  state.token = null;
  state.localUser = null;
  if (this.$router.currentRoute.name !== "Authorization") {
    this.$router.push({ name: "Authorization" });
  }
}
