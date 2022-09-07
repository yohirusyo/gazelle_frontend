export const getDriverById = (state) => (id) =>
  state.drivers.find((driver) => driver.id === id);

export const getFreeDrivers = (state, getters, rootState) => () => {
  const busyDrivers = rootState.transport.transports.map(t => t.driverId);
  return state.drivers.filter(d => !busyDrivers.includes(d.id) && d.isOnDriverShift);
}
