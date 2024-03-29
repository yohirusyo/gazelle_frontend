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
  user.role = user?.role ?? 'CUSTOMER';
  state.currentUser = user;
}

export function setOnlyFree(state, onlyFree) {
  state.onlyFree = onlyFree;
}


export function setOnlyWithDrivers(state, onlyWithDrivers) {
  state.onlyWithDrivers = onlyWithDrivers;
}

export function setOrderIsEmergency(state, orderIsEmergency) {
  state.orderIsEmergency = orderIsEmergency;
}

export function setRemoveOrderReason(state, removeOrderReason) {
  state.removeOrderReason = removeOrderReason;
}

export function setHoveredTransportId(state, hoveredTransportId) {
  state.hoveredTransportId = hoveredTransportId;
}

export function setCustomer(state, customer) {
  state.customer = customer;
}

export function setUser(state, user) {
  state.user = user;
}

export function clearUser(state) {
  state.user = null;
}

export function setRequest(state, request) {
  state.request = request;
}

export function setSwapped(state, swapped) {
  state.swapped = swapped;
}

export function setManagement(state, management) {
  state.management = management;
}