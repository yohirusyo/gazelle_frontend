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

export const filteredOrders = (state, getters, rootState) => ({ subdivisions }) => {
    return state.orders.filter(o => {
        const sub = rootState.customer.customers.find(c => c.id == o.customerId).subdivision;
        if (subdivisions && !subdivisions.includes(sub)) return false;
        return true;
    })
}