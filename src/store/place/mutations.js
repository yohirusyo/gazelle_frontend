export function add(state, place) {
  const index = state.places.findIndex((p) => p.id == place.id);
  if (index == -1)
    state.places.push(place);
}

export function set(state, places) {
  state.places = places;
}

export function update(state, place) {
  const index = state.places.findIndex((p) => p.id == place.id);
  state.places[index] = place;
}

export function remove(state, id) {
  state.places = state.places.filter((place) => place.id != id);
}
