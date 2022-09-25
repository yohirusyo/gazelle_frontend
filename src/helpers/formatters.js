import { date } from "quasar";

export const timeFormat = (d) => date.formatDate(d, "HH:mm")

export const formatContact = (c) => {
    if (!c) return '-';
    return `${c.fullname}\n${c.phoneNumber}`;
}

export const formatCustomer = (c) => {
    if (!c) return '-';
    return `${c.fullname}\n ( ${c.subdivision} )\n${c.phoneNumber}`;
}

export const formatDriver = (d) => {
    if (!d) return '-';
    return `${d.surname} ${d.name} ${d.middlename}\n${d.phoneNumber}`;
}

export const formatPlace = (p) => {
    if (!p) return '-';
    return `${p.name}`;
}

export const formatTransportNumber = (t) => {
    if (!t) return '-';
    return `${t.transportNumber}`
}