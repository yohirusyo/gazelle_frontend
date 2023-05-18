export const getByOnlyFreeFilter =
  (state) => (onlyFree, onlyWithDrivers, freeStatuses, isLocal) => {
    const transports =
      isLocal == null
        ? state.transports
        : state.transports.filter((t) => t.isLocal == isLocal);
    if (!onlyFree && !onlyWithDrivers) return transports;
    return transports.filter(
      (t) =>
        (!onlyFree || freeStatuses.includes(t.statusId)) &&
        (!onlyWithDrivers || (onlyWithDrivers && t.driverId != null))
    );
  };

export const getTransportById = (state) => (id) =>
  state.transports.find((transport) => transport.id === id);

export const getTypes = (state) => {
  return Array.from(new Set(state.transports.map((t) => t.type)));
};

export const getNumbers = (state) => {
  return Array.from(
    new Set(
      state.transports.map((t) => {
        const number = t.transportNumber.replace(/\s+/g, "");
        return number.substring(1, 4);
      })
    )
  );
};

export const getDrivers = (state) => {
  return Array.from(
    new Set(state.transports.map((t) => t.driverId).filter((id) => id != null))
  );
};
