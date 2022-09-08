export const getByOnlyFreeFilter = (state) => (onlyFree, freeStatuses) => {
    if (!onlyFree) return state.transports;
    return state.transports.filter(t => freeStatuses.includes(t.statusId))
}

export const getTransportById = (state) => (id) =>
    state.transports.find((transport) => transport.id === id);
