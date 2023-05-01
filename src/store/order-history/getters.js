import dayjs from "dayjs";

export const getSortedHistory = (state) => (onlyMy) => {
  const stateHistory = /* onlyMy
    ? state.history.filter((o) => o.orders[0].customerId == onlyMy)
    :  */state.history;
  return stateHistory;
};

export const getRequestById = (state) => (id) => {
  const item = state.history.find((item) => item.id == id);
  return item;
};
