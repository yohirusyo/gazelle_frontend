import { api } from "boot/axios";
import { showNotifyResult } from "src/helpers/notification";
import { socketio } from "boot/socketio";
import { requestHelper } from 'src/helpers/loader';

export async function requestOrders(context) {
  requestHelper(
    context,
    async () => {
      try {
        ['order_update', 'order_create', "order_update_done"].forEach(socketio.removeAllListeners)
      } catch (error) { }
      await api.get(`order`).then(({ data }) => {
        context.commit("set", data);
      })
      socketio.on('order_update', order => context.commit("update", order))
      socketio.on('order_create', order => context.commit("add", order))
      socketio.on("order_update_done", order => context.commit("remove", order))
    }
  )
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



export async function addOrderRequest({ commit }, form) {
  return api
    .post('/order/request', form)
    .then(({ data }) => {
      showNotifyResult(true, "Заказ успешно создан!");
      return data;
    })
    .catch((err) => {
      showNotifyResult(false, "Ошибка создания заказа!");
    });
}

export async function requestNames({ commit }) {
  return api
    .get(`order/names`)
    .then(({ data }) => {
      commit("setNames", data);
    })
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
  return api
    .patch(`order/swap-priority/${firstId}/${secondId}`)
}

