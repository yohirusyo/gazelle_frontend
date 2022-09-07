export const getByOnlyFreeFilter = (state) => (onlyFree, freeStatuses) => {
    if (!onlyFree) return state.transports;
    return state.transports.filter(t => freeStatuses.includes(t.statusId))
}
