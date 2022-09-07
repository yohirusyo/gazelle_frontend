import { api } from "boot/axios";

export async function requestCustomers({ commit }) {
  return api.get(`customer`).then(({ data }) => {
    commit("set", data);
  });
}
