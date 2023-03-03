export const getFilteredNames = (state) => (name) => {
    const data = (!!name && name != '') ?
        state.names.filter((subdivision) => subdivision.toLowerCase().includes(name.toLowerCase())) : state.names
    return data
}

export const getOrderById = (state) => (id) =>
    state.orders.find((order) => order.id === id);

export const subdivisions = (state, getters, rootState) => {
    return [...new Set(state.orders.map(order => (rootState.customer.customers.find(c => c.id == order.customerId))?.subdivision).filter(s => s != null))];
}

export const filteredOrders = (state, getters, rootState, rootGetters) => ({ subdivisions }) => {
    const busyStatuses = ['ACCEPTED', 'ENTRY_TO_CUSTOMER', 'ENTRY_TO_DESTINATION', 'EXIT_TO_DESTINATION'];
    return state.orders.filter(o => {
        if (o.parentOrder != o.id && o.parentOrder != null) return false;
        const sub = rootState.customer.customers.find(c => c.id == o.customerId)?.subdivision;
        if (subdivisions && !subdivisions.includes(sub)) return false;
        return true;
    }).sort((a, b) => {
        const aBusy = busyStatuses.includes(rootGetters['status/getStatusById'](a.statusId).code);
        const bBusy = busyStatuses.includes(rootGetters['status/getStatusById'](b.statusId).code);
        if ((aBusy && bBusy) || (!aBusy && !bBusy)) return 0;
        else if (aBusy) return 1
        return -1;
    })
}

export const orderRoute = (state) => (orderId) => {
    return state.orders.filter(o => o.parentOrder == orderId && !o.isApproved && o.isRequest && !o.isDeclined && o.id != orderId);
}

export const orderRouteFull = (state) => (orderId) => {
    return state.orders.filter(o => o.parentOrder == orderId && o.id != orderId);
}

export const isExpanded = (state) => (orderId) => {
    return state.expandedRoutes.includes(orderId);
}