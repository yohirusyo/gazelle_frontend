import dayjs from "dayjs";

export const getSortedHistory = (state) => (checkActive, date) => {

  let stateHistory = checkActive
    ? state.history.filter((m) => {
      return (m.isRequest == false && m.isDone == false) ||
        (m.isRequest == true && m.isDone == false && m.isApproved == true) || m.isRequest
    })
    : state.history

  stateHistory = stateHistory.filter((m) => {
    return date.from <= m.group && m.group <= date.to
  })
  
  return stateHistory;
};

export const getRequestById = (state) => (id) => {
  const item = state.history.find((item) => item.id == id);
  return item;
};
