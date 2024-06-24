import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "boot/socketio";
import { requestHelper } from "src/helpers/loader";

export async function requestOrders(context, ignore = false) {
  return requestHelper(
    context,
    async () => {
      try {
        ["order_update", "order_create", "order_update_done"].forEach(
          socketio.removeAllListeners
        );
      } catch (error) {}
      await api.get(`order/routes`).then(({ data }) => {
        context.commit("set", data);
      });
      socketio.on("order_update", (order) => context.commit("update", order));
      socketio.on("route_create", (route) => context.commit("addRoute", route));
      socketio.on("route_back", (route) => context.commit("backRoute", route));
      socketio.on("route_update", (route) =>
        context.commit("updateRoute", route)
      );
      socketio.on("route_delete", (id) => context.commit("removeRoute", id));
      socketio.on("route_complete", (id) => context.commit("completeRoute", id));
    },
    "",
    ignore
  );
}

export async function addOrder({ commit }, form) {
  return api
    .post(`order`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Заказ успешно создан!");
      return data;
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка создания заказа!");
    });
}

export async function addRoute({ commit }, form) {
  return api
    .post(`order/batch`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Маршрут успешно создан!");
      return data;
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка создания маршрута!");
    });
}

export async function updateRoute({ commit }, { id, ...form }) {
    return api
    .patch(`order/batch/${id}`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Маршрут успешно изменен!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка изменения маршрута!");
    });
}

export async function backRoute({ commit }, { id, ...form }) {
  return api
  .patch(`order/backToRequest/${id}`, form)
  .then(({ data }) => {
    showNotifyResult(true, "Маршрут успешно изменен!");
  })
  .catch((err) => {
    showNotifyResult(false, "Ошибка изменения маршрута!");
  });
}

export async function completeRoute({commit}, {id, ...form}) {
  return api
    .patch(`order/complete/${id}`, form)
    .then(({data}) => {
      showNotifyResult(true, "Маршрут успешно завершен");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка завершения маршрута")
    })
}

export async function addOrderRequest({ commit }, form) {
  return api
    .post("/order/request", form)
    .then(({ data }) => {
      showNotifyResult(true, "Заказ успешно создан!");
      return data;
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка создания заказа!");
    });
}

export async function requestNames({ commit }) {
  return api.get(`order/names`).then(({ data }) => {
    commit("setNames", data);
  });
}

export async function approveOrder({ commit }, { id, ...form }) {
  return api
    .patch(`order/approve/${id}`, form)
    .then(({ data }) => {
      showNotifyResult(true, "Заявка успешно принята!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка принятия заявки!");
    });
}

export async function declineOrder({ commit }, { id }) {
  return api
    .patch(`order/decline/${id}`)
    .then(({ data }) => {
      showNotifyResult(true, "Заявка успешно отклонена!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка отклонения заявки!");
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

export async function removeRoute({ commit }, { id, ...form }) {
  return api
    .post(`order/batch/${id}`, form)
    .then((_) => {
      showNotifyResult(true, "Маршрут успешно удален!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка удаления маршрута!");
    });
}

export async function backToRequest({ commit }, id) {
  return api
    .patch(`order/back-to-request/${id}`)
    .then((_) => {
      showNotifyResult(true, "Заявка успешно переведена в запрос!");
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка перевода заявки в запрос!");
    });
}

export async function swapPriority({ commit }, { firstId, secondId }) {
  return api.patch(`order/swap-priority/${firstId}/${secondId}`);
}
