export const getCustomerById = (state) => (id) =>
  state.customers.find((customer) => customer.id === id);

export const getFilteredCustomers = (state) => (fullname) => {
  const data = (!!fullname && fullname != '') ?
    state.customers.filter((customer) => customer.fullname.toLowerCase().includes(fullname.toLowerCase())) : state.customers
  return data
}

