export function add(state, contact) {
  state.contacts.push(contact);
}

export function set(state, contacts) {
  state.contacts = contacts;
}

export function update(state, contact) {
  console.warn(contact);
  const index = state.contacts.findIndex((o) => o.id == contact.id);
  state.contacts[index] = contact;
}

export function remove(state, id) {
  state.contacts = state.contacts.filter((contact) => contact.id != id);
}