import { api } from "boot/axios";

export async function requestOrderStats({ commit }) {
  return api.get(`order/stats`).then(({ data }) => {
    commit("set", data);
  });
}
