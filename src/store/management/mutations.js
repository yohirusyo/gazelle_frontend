function sort(state) {
  state.managements.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
}

export function add(state, management) {
  const index = state.managements.findIndex((p) => p.id == management.id);
  if (index == -1)
    state.managements.push(management);
}

export function set(state, managements) {
  state.managements = managements;
  // sort(state);
}

export function update(state, management) {
  const index = state.managements.findIndex((p) => p.id == management.id);
  if (index == -1) state.managements.push(management);
  else state.managements[index] = management;
}

export function remove(state, id) {
  state.managements = state.managements.filter((place) => management.id != id);
}

export function setLoading(state, loading) {
  state.isLoading = loading;
}

export function setLoaded(state, loaded) {
  state.isLoaded = loaded;
}

export function setLoadingMy(state, loading) {
  state.isLoadingMy = loading;
}

export function setLoadedMy(state, loaded) {
  state.isLoadedMy = loaded;
}