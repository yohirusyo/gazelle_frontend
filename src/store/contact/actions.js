import { api } from "boot/axios";

export async function requestContacts({ commit }) {
  return api.get(`contact`).then(({ data }) => {
    commit("set", data);
  });
}
