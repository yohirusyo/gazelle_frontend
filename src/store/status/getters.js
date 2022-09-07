export const getStatusByCode = (state) => (code) =>
  state.statuses.find((status) => status.code === code);

export const getStatusById = (state) => (id) =>
  state.statuses.find((status) => status.id === id);
