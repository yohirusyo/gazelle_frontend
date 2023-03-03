function sort(state) {
  state.orders.sort((a, b) => {
    if (a.isRequest && !a.isApproved && b.isRequest && !b.isApproved) {
      return a.priority - b.priority;
    } else if (a.isRequest && a.isApproved && b.isRequest && !b.isApproved) {
      return 1;
    } else if (b.isRequest && b.isApproved && a.isRequest && !a.isApproved) {
      return -1;
    } else if (a.isRequest && !a.isApproved && !b.isRequest) {
      return -1
    } else if (b.isRequest && !b.isApproved && !a.isRequest) {
      return 1;
    }
    return a.priority - b.priority
  }).filter(order => !order.isDeleted)
}

export function add(state, order) {
  const index = state.orders.findIndex((o) => o.id == order.id);
  if (index == -1) {
    state.orders.push(order);
    sort(state)
  }
}

export function set(state, orders) {
  state.orders = orders;
  sort(state)
}

export function rerender(state) {
  sort(state);
}

export function update(state, order) {
  const index = state.orders.findIndex((o) => o.id == order.id);
  if (index != -1) {
    const changedPriopity = state.orders[index].priority != order.priority || state.orders[index].statusId != order.statusId;
    state.orders[index] = order;
    if (changedPriopity) sort(state)
  }
}

export function remove(state, ord) {
  const index = state.orders.findIndex((o) => o.id == ord.id);
  state.orders[index] = ord;
  const order = state.orders[index];
  if (!order.parentOrder) { console.warn('solo'); return state.orders = state.orders.filter((order) => order.id != ord.id); }
  const isRouteNotDone = state.orders.some(o => o.parentOrder == order.parentOrder && o.isDone == false && o.id != ord.id);
  if (isRouteNotDone) return;
  state.orders = state.orders.filter((o) => o.parentOrder != order.parentOrder);
}


export function setCustomerFullname(state, fullname) {
  state.customerFullname = fullname;
}

export function setCustomerPhoneNumber(state, phoneNumber) {
  state.customerPhoneNumber = phoneNumber;
}

export function setCustomerSubdivision(state, subdivision) {
  state.customerSubdivision = subdivision;
}

export function setContactFullname(state, fullname) {
  state.contactFullname = fullname;
}

export function setContactPhoneNumber(state, phoneNumber) {
  state.contactPhoneNumber = phoneNumber;
}

export function setDestinationName(state, name) {
  state.destinationName = name;
}

export function setDeparturePointName(state, name) {
  state.departurePointName = name;
}

export function setNames(state, names) {
  state.names = names
}

export function setName(state, name) {
  state.name = name
}

export function setHovered(state, hovered) {
  state.hovered = hovered;
}

export function addToExpanded(state, id) {
  state.expandedRoutes.push(id);
}

export function removeFromExpanded(state, id) {
  state.expandedRoutes = state.expandedRoutes.filter(r => r.id != id)
}

export function setLoading(state, loading) {
  state.isLoading = loading;
}

export function setLoaded(state, loaded) {
  state.isLoaded = loaded;
}