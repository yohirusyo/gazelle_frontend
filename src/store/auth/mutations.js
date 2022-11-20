

export function setState(state, { prop, val }) {
  state[prop] = val;
}

export function authSuccess(state, { token, payload }) {
  state.token = token;
  state.username = null;
  state.password = null;
}

export function logout(state) {
  state.token = null;
  if (this.$router.currentRoute.name !== "Authorization") {
    this.$router.push({ name: "Authorization" });
  }
}
