function sort(state) {
  state.transports.sort((a, b) => {
    if (a.driverId == null && b.driverId == null) return a.id - b.id;
    if (a.driverId == null) return 1;
    if (b.driverId == null) return - 1;
    return `${a.driver?.surname} ${a.driver?.name} ${a.driver?.middlename}`.localeCompare(`${b.driver?.surname} ${b.driver?.name} ${b.driver?.middlename}`);
  })
}


export function add(state, transport) {
  const index = state.transports.findIndex((t) => t.id == transport.id);
  if (index == -1) {
    state.transports.push(transport);
    sort(state)
  }
}

export function set(state, transports) {
  state.transports = transports;
  sort(state)
}

export function update(state, transport) {
  const index = state.transports.findIndex((t) => t.id == transport.id);
  state.transports[index] = transport;
  sort(state)

}

export function remove(state, id) {
  state.transports = state.transports.filter((transport) => transport.id != id);
}

export function setLoading(state, loading) {
  state.isLoading = loading;
}

export function setLoaded(state, loaded) {
  state.isLoaded = loaded;
}