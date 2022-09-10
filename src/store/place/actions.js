import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "boot/socketio";

export async function requestPlaces({ commit }) {
  return api.get(`place`).then(({ data }) => {
    commit("set", data);
  });
}

export async function addPlace({ commit }, form) {
  return api
    .post(`place`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Место назначения успешно создано!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка создания места назначения!");
    });
}

export async function updatePlace({ commit }, { id, ...form }) {
  return api
    .patch(`place/${id}`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Место назначения успешно изменено!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка изменения места назначения!");
    });
}

export async function removePlace({ commit }, { id }) {
  return api
    .delete(`place/${id}`)
    .then((_) => {
      showNotifyResult(true, "Место назначения успешно удалено!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка удаления места назначения!");
    });
}

export async function subscribePlaceSockets({ commit }) {
  socketio.on('place_update', place => commit("update", place))
  socketio.on('place_create', place => commit("add", place))
  socketio.on("place_delete", id => commit("remove", id))
}
