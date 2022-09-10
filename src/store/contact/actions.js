import { api } from "boot/axios";
import { socketio } from "boot/socketio";

export async function requestContacts({ commit }) {
  return api.get(`contact`).then(({ data }) => {
    commit("set", data);
  });
}

export async function subscribeContactSockets({ commit }) {
  socketio.on('contact_update', contact => commit("update", contact))
  socketio.on('contact_create', contact => commit("add", contact))
  socketio.on("contact_delete", id => commit("remove", id))
}