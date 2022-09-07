export function add(state, transport) {
  state.transports.push(transport);

}

export function set(state, transports) {
  state.transports = transports;

}

export function update(state, transport) {
  const index = state.transports.findIndex((t) => t.id == transport.id);
  state.transports[index] = transport;

}

export function remove(state, id) {
  state.transports = state.transports.filter((transport) => transport.id != id);

}
