export const getFilteredNames = (state) => (name) => {
    const data = (!!name && name != '') ?
        state.names.filter((subdivision) => subdivision.toLowerCase().includes(name.toLowerCase())) : state.names
    return data
}
