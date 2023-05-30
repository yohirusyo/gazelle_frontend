import _ from "lodash"

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

export const getMinSelectedDate = (state) => (date) => {

return state.history == [] ? date : _.minBy(state.history, function(el) {
  return el.group.split("-").join("")
}).group

}

export const getMaxSelectedDate = (state) => (date) => {

  return state.history == [] ? date : _.maxBy(state.history, function(el) {
    return el.group.split("-").join("")
  }).group

}

export const getRequestById = (state) => (id) => {
  const item = state.history.find((item) => item.id == id);
  return item;
};
