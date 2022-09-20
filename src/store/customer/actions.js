import { api } from "boot/axios";
import { socketio } from "boot/socketio";
import { showNotifyResult } from "src/helpers/notification";

export async function addCustomer({ commit }, form) {
  return api
    .post(`customer`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Заказчик успешно создан!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка создания заказчика!");
    });
}

export async function updateCustomer({ commit }, { id, ...form }) {
  return api
    .patch(`customer/${id}`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Заказчик успешно изменен!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка изменения заказчика!");
    });
}

export async function requestCustomers({ commit }) {
  return api.get(`customer`).then(({ data }) => {
    commit("set", data);
  });
}

export async function subscribeCustomerSockets({ commit }) {
  socketio.on('customer_update', customer => commit("update", customer))
  socketio.on('customer_create', customer => commit("add", customer))
  socketio.on("customer_delete", id => commit("remove", id))
}