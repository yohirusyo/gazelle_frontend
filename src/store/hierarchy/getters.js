export const myWorkers = (state, getters, rootState) =>
  state.hierarchy?.filter(
    (h) =>
      h.bossId == rootState.current.currentUser.id ||
      (h.subdivision == rootState.current.currentUser.subdivision &&
        h.ownerId != rootState.current.currentUser.id)
  );

export const myHierarchy = (state, getters, rootState) => {
  const subdivisionHierarchy = state.hierarchy.find(
    (h) => h.subdivision == rootState.current.currentUser.subdivision
  );
  if (subdivisionHierarchy) return subdivisionHierarchy;
  const ownerHierarchy = state.hierarchy?.find(
    (h) => h.ownerId == rootState.current.currentUser.id
  );
  if (ownerHierarchy) return ownerHierarchy;
  return state.hierarchy?.find(
    (h) => h.bossId == rootState.current.currentUser.id
  );
};

export const spendedToWorkers = (state, getters, rootState) => {
  const workers = getters.myWorkers;
  return workers.reduce((prev, curr) => prev + curr.monthFactLimit, 0);
};

export const freeLimit = (state, getters, rootState) => {
  const workers = getters.myWorkers;
  const myHierarchy = getters.myHierarchy;
  const spendedToWorkers = getters.spendedToWorkers;
  if (!workers || !myHierarchy) return 0;
  return myHierarchy.monthFactLimit - spendedToWorkers;
};

export const getManagementRequests = (state) => (managementId) => {
  return state.managementRequests[managementId];
};

export const myUnusedLimit = (state, getters, rootState, rootGetters) => {
  const myHierarchy = getters.myHierarchy;
  if (myHierarchy?.isSubdivision) {
    const myManagement = rootGetters["management/myManagement"]?.limits[0];
    return myManagement?.fact - myManagement?.used - myManagement?.technologicalTransport;
  }
  const spendedToWorkers = getters.spendedToWorkers;
  return (
    myHierarchy?.monthFactLimit - myHierarchy?.monthUsed - spendedToWorkers
  );
};
