export const getManagementById = (state) => (id) =>
  state.managements.find((management) => management.id === id);

export const myManagement = (state, getters, rootState) =>
  state.managements.find(
    (m) => m.id == rootState.current.currentUser.managementId
  );

export const limitWarning =
  (state, getters) =>
  (percentage = 10) => {
    const myManagement = getters.myManagement;
    if (!myManagement) return;
    const month = myManagement?.limits[0];
    const unusedLimit = month?.fact - month?.used;
    const unusedLimitPercentage = (unusedLimit / month?.plan) * 100;
    const perc = Math.round(unusedLimitPercentage);
    if (perc > percentage) return;
    return perc;
  };
