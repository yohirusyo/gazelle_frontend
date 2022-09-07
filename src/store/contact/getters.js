export const getContactById = (state) => (id) =>
  state.contacts.find((contact) => contact.id === id);

export const getFilteredContacts = (state) => (fullname) => {
  const data = (!!fullname && fullname != '') ?
    state.contacts.filter((contact) => contact.fullname.toLowerCase().includes(fullname.toLowerCase())) : state.contacts
  return data
}

