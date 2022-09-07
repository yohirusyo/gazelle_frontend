export function add(state, order) {
  state.orders.push(order);
}

export function set(state, orders) {
  state.orders = orders;
}

export function update(state, order) {
  console.warn(order);
  const index = state.orders.findIndex((o) => o.id == order.id);
  state.orders[index] = order;
  console.warn(state.orders);
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

export function setContactFullname(state, fullname) {
  state.contactFullname = fullname;
}

export function setContactPhoneNumber(state, phoneNumber) {
  state.contactPhoneNumber = phoneNumber;
}