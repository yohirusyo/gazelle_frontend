// Авторизация пользователя
import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";

export async function Signin({ commit }, form) {
  return api
    .post(`auth`, form)
    .then(({ data }) => {
      commit("authSuccess", data);
      showNotifyResult(true, "Успешно");
    })
    .catch((err) => {
      commit("logout");
      showNotifyResult(false, "Ошибка авторизации");
    });
}

// Выход
export function logout({ commit }) {
  commit("logout");
  showNotifyResult(false, "Ошибка авторизации");
}
