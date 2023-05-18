import { api } from "boot/axios";
import { socketio } from "boot/socketio";
import { showNotifyResult } from "src/helpers/notification";
import { requestHelper } from "src/helpers/loader";

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

export async function requestCustomers(context, ignore = false) {
  return requestHelper(
    context,
    async () => {
      try {
        ["customer_update", "customer_create", "customer_delete"].forEach(
          socketio.removeAllListeners
        );
      } catch (error) {}
      await api.get(`customer`).then(({ data }) => {
        context.commit("set", data);
      });
      socketio.on("customer_update", (customer) =>
        context.commit("update", customer)
      );
      socketio.on("customer_create", (customer) =>
        context.commit("add", customer)
      );
      socketio.on("customer_delete", (id) => context.commit("remove", id));
    },
    "",
    ignore
  );
}
