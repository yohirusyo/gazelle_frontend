export function addDriver(state, driver) {
  state.drivers.push(driver);
}

export function setDrivers(state, drivers) {
  state.drivers = drivers;
}

export function update(state, driver) {
  const index = state.drivers.findIndex((d) => (d.id = driver.id));
  state.drivers[index] = driver;
}

export function remove(state, id) {
  state.drivers = state.drivers.filter((driver) => driver.id != id);
}

export function setOperators(state, operators) {
  state.operators = operators;
}