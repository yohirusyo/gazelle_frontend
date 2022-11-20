function sortDrivers(state) {
  state.drivers.sort((a, b) => {
    return `${a.surname} ${a.name} ${a.middlename}`.localeCompare(`${b.surname} ${b.name} ${b.middlename}`);
  })
}

export function addDriver(state, driver) {
  const index = state.drivers.findIndex((d) => d.id == driver.id);
  if (index == -1)
    state.drivers.push(driver);
  sortDrivers(state)
}

export function setDriver(state, drivers) {
  state.drivers = drivers;
  sortDrivers(state)
}

export function updateDriver(state, driver) {
  const index = state.drivers.findIndex((d) => d.id == driver.id);
  state.drivers[index] = driver;
  sortDrivers(state)
}

export function removeDriver(state, id) {
  state.drivers = state.drivers.filter((driver) => driver.id != id);
  sortDrivers(state)
}

export function setOperators(state, operators) {
  state.operators = operators;
}

function sortUsers(state) {
  state.users.sort((a, b) => {
    return `${a.surname} ${a.name} ${a.middlename}`.localeCompare(`${b.surname} ${b.name} ${b.middlename}`);
  })
}

export function addUser(state, user) {
  const index = state.users.findIndex((u) => u.id == user.id);
  if (index == -1)
    state.users.push(user);
  sortUsers(state)
}

export function setUser(state, users) {
  state.users = users;
  sortUsers(state)
}

export function updateUser(state, user) {
  const index = state.users.findIndex((u) => u.id == user.id);
  state.users[index] = user;
  sortUsers(state)
}

export function removeUser(state, id) {
  state.users = state.users.filter((user) => user.id != id);
  sortUsers(state)
}
