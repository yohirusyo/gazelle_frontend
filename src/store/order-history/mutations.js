function sort(state) {
  state.history.sort((a, b) => {
    return a.order.id - b.order.id;
  })
}

export function set(state, history) {
  state.history = history;
  sort(state);
}

export function add(state, order) {
  const index = state.history.findIndex((o) => o.id == order.id);
  if (index == -1)
    state.history.push(order);
  sort(state)
}

export function update(state, order) {
  const index = state.history.findIndex((o) => o.id == order.id);
  state.history[index] = order;
  sort(state)
}

export function remove(state, id) {
  state.history = state.history.filter((order) => order.id != id);
}
