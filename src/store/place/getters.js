export const getPlaceById = (state) => (id) =>
  state.places.find((place) => place.id === id);
