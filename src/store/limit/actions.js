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
  console.log(item);
  return api
    .post(`control/monthlimits/${item.year}/${item.month}`, item.data)
    .then(({ data }) => {
      console.log(data);
    });
}
