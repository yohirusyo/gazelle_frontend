function sort(state) {
  state.history.sort((a, b) => {
    return a.createdAt - b.createdAt;
  }).map((r, index) => {
    if (index === 0) return r.head = true;
    if (state.history[index].group != state.history[index - 1].group) return r.head = true;
    return r;
  })
}

export function set(state, history) {
  state.history = history;
  sort(state);
}


export function update(state, order) {
  console.log(order);
  const index = state.history.findIndex((o) => o.id == order.id);
  if (index == -1)
    state.history.push(order);
  else
    state.history[index] = order;
  sort(state)
}

export function remove(state, id) {
  state.history = state.history.filter((order) => order.id != id);
}
