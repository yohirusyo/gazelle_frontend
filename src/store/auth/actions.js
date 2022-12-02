// Авторизация пользователя
import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";

export async function Signin({ commit, dispatch }, form) {

  return api
    .post(`auth`, form)
    .then(({ data }) => {
      localStorage.setItem("token", "Bearer " + data.token);
      api.defaults.headers["Authorization"] = localStorage.getItem("token");
      commit("authSuccess", data);
      dispatch('current/requestCurrentUser', null, { root: true })
      showNotifyResult(true, "Успешно");
    })
    .catch((err) => {
      commit("logout");
      showNotifyResult(false, "Ошибка авторизации");
    });
}

// Выход
export function logout({ commit }) {
  localStorage.removeItem("token");
  delete api.defaults.headers["Authorization"];
  commit("logout");
  commit('current/setCurrentUser', null, { root: true })
  showNotifyResult(false, "Ошибка авторизации");
}

export async function resetPassword({ commit }, { id, isUser }) {
  return api.patch(`auth/reset-password/${isUser ? 'user' : 'customer'}/${id}`)
    .then(({ data }) => {
      showNotifyResult(true, "Пароль успешно сброшен!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка сброса пароля!");
    });
}
