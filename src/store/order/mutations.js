export function add(state, order) {
  state.orders.push(order);
}

export function set(state, orders) {
  state.orders = orders;
}

export function update(state, order) {
  const index = state.orders.findIndex((o) => o.id == order.id);
  state.orders[index] = order;
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
  state.names = names.map(n => n.name)
}

export function setName(state, name) {
  state.name = name
}