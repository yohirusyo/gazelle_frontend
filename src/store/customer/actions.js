import { api } from "boot/axios";
import { socketio } from "boot/socketio";

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