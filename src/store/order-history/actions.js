import { api } from "boot/axios";
import { socketio } from "boot/socketio";

export async function requestHistory({ commit }, filter) {
  return api.get(`/order/customer-orders/new`, {
    params: {
      filter
    }
  }).then(({ data }) => {
    commit("set", data);
  });
}

export async function subscribeHistorySockets({ commit, rootState }) {
  // socketio.on(`order_create:customernewsubdivision:${rootState.current.currentUser.subdivision}`, order => commit("add", order))
  // socketio.on(`order_update:customernewsubdivision:${rootState.current.currentUser.subdivision}`, order => commit("update", order))
  // socketio.on(`order_delete:customernewsubdivision:${rootState.current.currentUser.subdivision}`, id => commit("remove", id))
  socketio.on(`order_update:customernew:${rootState.current.currentUser.id}`, order => commit("update", order))
  socketio.on(`order_delete:customernew:${rootState.current.currentUser.id}`, id => commit("remove", id))
}