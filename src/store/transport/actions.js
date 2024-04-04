import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "src/boot/socketio";
import { requestHelper } from "src/helpers/loader";

export async function requestTransports(context, ignore = false) {
  return requestHelper(
    context,
    async () => {
      try {
        ["transport_update", "transport_create", "transport_delete"].forEach(
          socketio.removeAllListeners
        );
      } catch (error) {}
      await api.get(`transport`).then(({ data }) => {
        context.commit("set", data);
      });
      socketio.on("transport_update", (transport) =>
        context.commit("update", {
          ...transport,
          driver: context.rootGetters["user/getDriverById"](transport.driverId),
        })
      );
      socketio.on("transport_create", (transport) =>
        context.commit("add", {
          ...transport,
          driver: context.rootGetters["user/getDriverById"](transport.driverId),
        })
      );
      socketio.on("transport_delete", (id) => context.commit("remove", id));
    },
    "",
    ignore
  );
}

export async function addTransport({ commit }, form) {
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

export async function requestPlaces({ commit }) {
  return api
    .get("loading")
    .then((res) => res.data)
    .then((places) => {
      commit("setPlaces", places);
    });
}

export async function addPlace({ commit }, form) {
  return api
    .post(`loading`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Место успешно создано!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка");
    });
}

export async function updatePlace({ commit }, form) {
  return api
    .post(`loading/${form.id}`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Место успешно изменено!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка", err);
    });
}

export async function deletePlace({ commit }, form) {
  return api
    .delete(`loading/${form.id}`)
    .then(({ data }) => {
      showNotifyResult(true, "Место успешно удалено!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка");
    });
}