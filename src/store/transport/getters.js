export const getByOnlyFreeFilter = (state) => (onlyFree, onlyWithDrivers, freeStatuses, isLocal) => {
    const transports = isLocal == null ? state.transports : state.transports.filter(t => t.isLocal == isLocal)
    if (!onlyFree && !onlyWithDrivers) return transports;
    return transports.filter(
        t => (!onlyFree || freeStatuses.includes(t.statusId)) && (!onlyWithDrivers || (onlyWithDrivers && t.driverId != null))
    )
}

export const getTransportById = (state) => (id) =>
    state.transports.find((transport) => transport.id === id);
