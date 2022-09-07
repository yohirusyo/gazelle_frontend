import { api } from "boot/axios";

export async function requestStatuses({ commit }) {
  return api.get(`status`).then(({ data }) => {
    commit("set", data);
  });
}
