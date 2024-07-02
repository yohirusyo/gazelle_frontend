export const getPlaceById = (state) => (id) => {
  return state.places.find((place) => place.id === id);
} 

export const getPlaceByNameAddedManualyTrue = (state) => (name) => {
  return state.places.find((place) => place.name === name && !place.isDeleted && place.addedManualy);
} 

export const getFilteredPlaces = (state) => (name) => {
  const data = (!!name && name != '') ?
    state.places.filter((place) => place.name.toLowerCase().includes(name.toLowerCase())) : state.places
  return data
}

