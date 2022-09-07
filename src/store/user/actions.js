import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";


export async function requestDrivers({ commit }) {
  return api.get(`user/drivers`).then(({ data }) => {
    commit("setDrivers", data);
  });
}

export async function addDriver(
  { commit },
  { name, surname, middlename, login, phoneNumber }
) {
  return api
    .post(`user`, {
      name,
      surname,
      middlename,
      login,
      password: "123456789",
      role: "DRIVER",
      phoneNumber,
    })
    .then(({ data }) => {
      commit("addDriver", data);
      showNotifyResult(true, "Водитель успешно зарегистрирован!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка регистрации водителя!");
    });
}

export async function updateDriver({ commit }, { id, ...form }) {
  return api
    .patch(`user/${id}`, form)
    .then(({ data }) => {
      commit("update", data);
      showNotifyResult(true, "Данные водителя успешно изменен!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка изменения данных водителя!");
    });
}

export async function removeDriver({ commit }, { id }) {
  return api
    .delete(`user/${id}`)
    .then((_) => {
      commit("remove", id);
      showNotifyResult(true, "Данные водителя успешно удалены!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка удаления данных водителя!");
    });
}

export async function requestOperators({ commit }) {
  return api.get(`user/operators`).then(({ data }) => {
    commit("setOperators", data);
  });
}