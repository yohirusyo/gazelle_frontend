export function set(state, hierarchy) {
  state.hierarchy = hierarchy || [];
}

export function setManagement(state, { limitRequests, managementId }) {
  state.managementRequests[managementId] = limitRequests || [];
}

export function update(state, hierarchy) {
  const index = state.hierarchy.findIndex((p) => p.id == hierarchy.id);
  if (index == -1) state.hierarchy.push(hierarchy);
  else state.hierarchy[index] = hierarchy;
}

export function lrupdate(state, lr) {
  Object.entries(state.managementRequests).forEach(([managementId, requests]) => {
    const index = state.managementRequests[managementId].findIndex((p) => p.id == lr.id);
    if (index == -1) state.managementRequests[managementId].push(lr);
    else state.managementRequests[managementId][index] = lr;
  })

  for (const h of state.hierarchy) {
    if (h.id == lr.hierarchyId) {
      const idx = h.requests.findIndex((r) => r.id == lr.id)
      if (idx == -1) h.requests.push(lr);
      else h.requests[idx] = lr;
    }

  }
}

export function setLoadingHierarchy(state, loading) {
  state.isLoadingHierarchy = loading;
}

export function setLoadedHierarchy(state, loaded) {
  state.isLoadedHierarchy = loaded;
}

export function setLoadingManagement(state, loading) {
  state.isLoadingManagement = loading;
}

export function setLoadedManagement(state, loaded) {
  state.isLoadedManagement = loaded;
}