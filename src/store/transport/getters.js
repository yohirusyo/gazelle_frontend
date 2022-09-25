export const getByOnlyFreeFilter = (state) => (onlyFree, onlyWithDrivers, freeStatuses) => {
    if (!onlyFree && !onlyWithDrivers) return state.transports;
    return state.transports.filter(t => (!onlyFree || freeStatuses.includes(t.statusId)) && (!onlyWithDrivers || (onlyWithDrivers && t.driverId != null)))
}

export const getTransportById = (state) => (id) =>
    state.transports.find((transport) => transport.id === id);
