export const getPlaceById = (state) => (id) =>
  state.places.find((place) => place.id === id);

export const getFilteredPlaces = (state) => (name) => {
  const data = (!!name && name != '') ?
    state.places.filter((place) => place.name.toLowerCase().includes(name.toLowerCase())) : state.places
  return data
}

