import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "boot/socketio";
import { requestHelper } from "src/helpers/loader";

export async function requestPlaces(context, ignore = false) {
  return requestHelper(
    context,
    async () => {
      try {
        ["place_update", "place_create", "place_delete"].forEach(
          socketio.removeAllListeners
        );
      } catch (error) {}
      await api.get(`place`).then(({ data }) => {
        context.commit("set", data);
      });
      socketio.on("place_update", (place) => context.commit("update", place));
      socketio.on("place_create", (place) => context.commit("add", place));
      socketio.on("place_delete", (id) => context.commit("remove", id));
    },
    "",
    ignore
  );
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
