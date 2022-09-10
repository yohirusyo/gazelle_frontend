import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "src/boot/socketio";

export async function requestTransports({ commit }) {
  return api.get(`transport`).then(({ data }) => {
    commit("set", data);
  });
}

export async function addTransport(
  { commit },
  form
) {
  return api
    .post(`transport`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Транспорт успешно создан!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка создания транспорта!");
    });
}

export async function updateTransport({ commit }, { id, ...form }) {
  return api
    .patch(`transport/${id}`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Транспорт успешно изменен!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка изменения транспорта!", err);
    });
}

export async function removeTransport({ commit }, { id }) {
  return api
    .delete(`transport/${id}`)
    .then((_) => {
      showNotifyResult(true, "Транспорт успешно удален!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка удаления транспорта!");
    });
}

export async function subscribeTransportSockets({ commit }) {
  socketio.on('transport_update', transport => commit("update", transport))
  socketio.on('transport_create', transport => commit("add", transport))
  socketio.on("transport_delete", id => commit("remove", id))
}
