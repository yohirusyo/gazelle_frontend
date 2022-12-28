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
  }).filter(order => !order.isDone && !order.isDeleted)
}

export function add(state, order) {
  const index = state.orders.findIndex((o) => o.id == order.id);
  if (index == -1)
    state.orders.push(order);
  sort(state)
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
  state.orders[index] = order;
  sort(state)
}

export function remove(state, id) {
  state.orders = state.orders.filter((order) => order.id != id);
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