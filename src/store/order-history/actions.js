import { api } from "boot/axios";
import { socketio } from "boot/socketio";

export async function requestHistory({ commit }) {
  return api.get(`/order/customer-orders/new`).then(({ data }) => {
    commit("set", data);
  });
}

export async function subscribeHistorySockets({ commit, rootState }) {
  socketio.on(`order_create:customernew:${rootState.current.currentUser.id}`, order => commit("add", order))
  socketio.on(`order_update:customernew:${rootState.current.currentUser.id}`, order => commit("update", order))
  socketio.on(`order_delete:customer:${rootState.current.currentUser.id}`, id => commit("remove", id))
}