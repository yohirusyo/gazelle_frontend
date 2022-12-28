import { api } from "boot/axios";
import { formatDriverMobileFullname } from "src/helpers/formatters";


export async function requestShiftStats({ commit, rootGetters }, dates) {
  return api.get(`user/stats`, {
    params: dates
  }).then(({ data }) => {
    commit("set", data.map(d => ({
      ...d,
      driverFullname: formatDriverMobileFullname(rootGetters['user/getDriverById'](d.driverId)),
      transportNumber: rootGetters['transport/getTransportById'](d.transportId).transportNumber,
    })));
  });
}


export async function requestShiftStatsDates({ commit }) {
  return api.get(`user/stats-dates`).then(({ data }) => {
    commit("setMinMax", data);
  });
}

export async function requestOperatorShiftStats({ commit, rootGetters }, dates) {
  return api.get(`user/operator/stats`, {
    params: dates
  }).then(({ data }) => {
    commit("setOperator", data);
  });
}


export async function requestOperatorShiftStatsDates({ commit }) {
  return api.get(`user/operator/stats-dates`).then(({ data }) => {
    commit("setMinMaxOperator", data);
  });
}