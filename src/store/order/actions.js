import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "boot/socketio";

export async function addOrder({ commit }, form) {
  return api
    .post(`order`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Заказ успешно создан!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка создания заказа!");
    });
}

export async function requestOrders({ commit }) {
  return api.get(`order`).then(({ data }) => {
    commit("set", data);
  });
}

export async function updateOrder({ commit }, { id, ...form }) {
  return api
    .patch(`order/${id}`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Заявка успешно изменена!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка изменения заявки!");
    });
}

export async function removeOrder({ commit }, { id }) {
  return api
    .delete(`order/${id}`)
    .then((_) => {
      showNotifyResult(true, "Заявка успешно удалена!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка удаления заявки!");
    });
}

export async function subscribeOrderSockets({ commit }) {
  socketio.on('order_update', order => {
    if (order.isDone) return commit("remove", order.id)
    commit("update", order)
  })
  socketio.on('order_create', order => commit("add", order))
  socketio.on("order_delete", id => commit("remove", id))
}