export const getManagementById = (state) => (id) =>
  state.managements.find((management) => management.id === id);

export const myManagement = (state, getters, rootState) => state.managements.find(m => m.id == rootState.current.currentUser.managementId);