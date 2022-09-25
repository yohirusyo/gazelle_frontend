export function add(state, customer) {
  const index = state.customers.findIndex((o) => o.id == customer.id);
  if (index == -1)
    state.customers.push(customer);
}

export function set(state, customers) {
  state.customers = customers;
}

export function update(state, customer) {
  const index = state.customers.findIndex((o) => o.id == customer.id);
  state.customers[index] = customer;
}

export function remove(state, id) {
  state.customers = state.customers.filter((customer) => customer.id != id);
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