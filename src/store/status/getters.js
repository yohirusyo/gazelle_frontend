export const getStatusByCode = (state) => (code) =>
  state.statuses.find((status) => status.code === code);

export const getStatusById = (state) => (id) =>
  state.statuses.find((status) => status.id === id);

export const getBusyStatusesCodes = (state) => () =>
  state.statuses.filter((s) => s.isBusy == true).map((s) => s.code);
