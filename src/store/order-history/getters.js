import dayjs from "dayjs";

export const getSortedHistory = (state) => (checkActive, date) => {
  const stateHistory = checkActive
    ? state.history.filter((m) => {
        return !m.isDone && ((m.isReqest && !m.isDeclined) || !m.isReqest);
      })
    : state.history;

  return stateHistory.filter((m) => {
    return date.from <= m.group && m.group <= date.to;
  });
};

export const getRequestById = (state) => (id) => {
  const item = state.history.find((item) => item.id == id);
  return item;
};
