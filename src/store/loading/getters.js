export const isLoading = (state, getters, rootState) => {
    return rootState.contact.isLoading ||
        rootState.customer.isLoading ||
        rootState.hierarchy.isLoadingHierarchy ||
        rootState.hierarchy.isLoadingManagement ||
        rootState.management.isLoading ||
        rootState.management.isLoadingMy ||
        rootState.order.isLoading ||
        rootState.place.isLoading ||
        rootState.status.isLoading ||
        rootState.transport.isLoading ||
        rootState.user.isLoadingDrivers ||
        rootState.user.isLoadingOperators ||
        rootState.user.isLoadingUsers

}
