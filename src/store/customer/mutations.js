function sort(state) {
  state.customers.sort((a, b) => {
    return `${a.subdivision}${a.fullname}${a.phoneNumber}`.localeCompare(`${b.subdivision}${b.fullname}${b.phoneNumber}`)
  })
}


export function add(state, customer) {
  const index = state.customers.findIndex((o) => o.id == customer.id);
  if (index == -1)
    state.customers.push(customer);
  sort(state)
}

export function set(state, customers) {
  state.customers = customers;
  sort(state)
}

export function updateCustomerLimit(state, hierarchy) {
  state.customers.forEach(function (e, index) {
    if (e.managementId == hierarchy.managementId) {
      state.customers[index].monthFactLimit = Number(hierarchy.monthFactLimit);
      state.customers[index].monthPlanLimit = Number(hierarchy.monthPlanLimit);
    }
})
}
export function update(state, customer) {
  const index = state.customers.findIndex((o) => o.id == customer.id);
  state.customers[index] = customer;
  sort(state)
}

export function remove(state, id) {
  state.customers = state.customers.filter((customer) => customer.id != id);
  sort(state)
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

export function setLoading(state, loading) {
  state.isLoading = loading;
}

export function setLoaded(state, loaded) {
  state.isLoaded = loaded;
}