import * as moment from "moment";

export const getSortedHistory = (state) => (onlyMy) => {
  console.log({ onlyMy });
  const stateHistory = onlyMy
    ? state.history.filter((o) => o.orders[0].customerId == onlyMy)
    : state.history;
  return stateHistory;
};

export const getRequestById = (state) => (id) => {
  const item = state.history.find((item) => item.id == id);
  return item;
};
