import { api } from "boot/axios";

export async function requestOrderStats({ commit }, dates) {
  return api.get(`order/stats`, {
    params: dates
  }).then(({ data }) => {
    commit("set", data);
  });
}


export async function requestOrderStatsDates({ commit }) {
  return api.get(`order/stats-dates`).then(({ data }) => {
    commit("setMinMax", data);
  });
}