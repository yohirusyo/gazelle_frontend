import { api } from "boot/axios";

export async function getAllControlLimits(context) {
  return api.get(`control`).then(({ data }) => {
    context.commit("setAllControlLimits", data);
  });
}

export async function getMonthLimitSubdivisions(context, item) {
  return api
    .get(`control/monthlimit/${item.year}/${item.month}`)
    .then(({ data }) => {
      context.commit("setMonthLimitSubdivisions", data);
    });
}

export async function postMonthLimit(context, item) {
  return api.post(`control/monthlimits/${item.year}/${item.month}`, item.data);
}

export async function postEditControl(context, item) {
  return api.post(`control/edit/${item.year}/${item.month}`, item.data);
}

export async function getStatsContorlLimits(context, item) {
  return api
    .get(
      `order/stats-control?period=${item.period}&month=${item.month}&year=${item.year}&mvz=${item.mvz}`
    )
    .then(({ data }) => {
      context.commit("setStatsControl", data);
    });
}

export async function getHoursStatsContorlLimits(context, item) {
  return api
    .get(`order/stats-control/hours?month=${item.month}&year=${item.year}`)
    .then(({ data }) => {
      context.commit("setHoursStatsControl", data);
    });
}

export async function limitTransfer(context, data) {
  return api.post(`management/limit-transfer`, data);
}

export async function getLimitTransfer(context, item) {
  return api.get(`management/get-limit-transfer/${item.year}/${item.month}`).then(({data}) => {
    context.commit("getLimitTransfer", data);
  })
}
