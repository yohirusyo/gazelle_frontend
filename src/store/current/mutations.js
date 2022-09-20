export function setCoords(state, coords) {
  state.coords = coords;
}

export function clearCoords(state) {
  state.coords = null;
}

export function setPlace(state, place) {
  state.place = place;
}

export function clearPlace(state) {
  state.place = null;
}

export function changePlaceProperty(state, { prop, val }) {
  state.place[prop] = val;
}

export function setDriver(state, driver) {
  state.driver = driver;
}

export function clearDriver(state) {
  state.driver = null;
}

export function changeDriverProperty(state, { prop, val }) {
  state.driver[prop] = val;
}

export function setOrder(state, order) {
  state.order = order;
}

export function clearOrder(state) {
  state.order = null;
}

export function changeOrderProperty(state, { prop, val }) {
  state.order[prop] = val;
}

export function setTransport(state, transport) {
  state.transport = transport;
}

export function clearTransport(state) {
  state.transport = null;
}

export function changeTransportProperty(state, { prop, val }) {
  state.transport[prop] = val;
}

export function setSelectedTransportId(state, transportId) {
  state.selectedTransportId = transportId;
}

export function clearSelectedTransportId(state) {
  state.selectedTransportId = null;
}

export function setCurrentUser(state, user) {
  state.currentUser = user;
}

export function setOnlyFree(state, onlyFree) {
  state.onlyFree = onlyFree;
}

export function setOrderIsEmergency(state, orderIsEmergency) {
  state.orderIsEmergency = orderIsEmergency;
}

export function setHoveredTransportId(state, hoveredTransportId) {
  state.hoveredTransportId = hoveredTransportId;
}

export function setCustomer(state, customer) {
  state.customer = customer;
}