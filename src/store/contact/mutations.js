export function add(state, contact) {
  const index = state.contacts.findIndex((o) => o.id == contact.id);
  if (index == -1)
    state.contacts.push(contact);
}

export function set(state, contacts) {
  state.contacts = contacts;
}

export function update(state, contact) {
  const index = state.contacts.findIndex((o) => o.id == contact.id);
  state.contacts[index] = contact;
}

export function remove(state, id) {
  state.contacts = state.contacts.filter((contact) => contact.id != id);
}

export function setLoading(state, loading) {
  state.isLoading = loading;
}

export function setLoaded(state, loaded) {
  state.isLoaded = loaded;
}