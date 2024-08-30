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

export async function requestMvzStats({commit}, {from, to, toggle},) {
  return api.get(`order/mvz?from=${from}&to=${to}&transport=${toggle}`).then(({ data }) => {
    commit("setMvz", data);
  });
}

export async function requestSubdivisionStats({commit}, {from, to}) {
  return api.get(`order/subdivision?from=${from}&to=${to}`).then(({ data }) => {
    commit("setSubdivision", data);
  });
}

export async function requestTimeStats({commit}, {from, to}) {
  return api.get(`order/timeStats?from=${from}&to=${to}`).then(({ data }) => {
    commit("setTime", data);
  });
}

export async function getStatsIndicatorReport(context, item) {
  return api
    .get(`order/indicator-stats?month=${item.month}&year=${item.year}`)
    .then(({ data }) => {
      context.commit("setStatsIndicatorReport", data);
    });
}
