export function add(state, customer) {
  state.customers.push(customer);
}

export function set(state, customers) {
  state.customers = customers;
}

export function update(state, customer) {
  console.warn(customer);
  const index = state.customers.findIndex((o) => o.id == customer.id);
  state.customers[index] = customer;
}

export function remove(state, id) {
  state.customers = state.customers.filter((customer) => customer.id != id);
}