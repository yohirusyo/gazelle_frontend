import { date } from "quasar";
import dayjs from 'dayjs';

export const timeFormat = (d) => date.formatDate(d, "HH:mm")

export const timeFormatOrder = (d) => {
    if (!d) return
    const now = dayjs();
    const dd = dayjs(d);
    if (!now.isSame(dd, 'date'))
        return dd.format('DD.MM.YYYY')
}

export const formatContact = (c) => {
    if (!c) return '-';
    return `${c.fullname}\n${c.phoneNumber}`;
}

export const formatCustomer = (c) => {
    if (!c) return '-';
    return `${c.fullname}\n ( ${c.subdivision} )\n${c.phoneNumber}`;
}

export const formatCustomerMobileFullname = (c) => {
    if (!c) return '-';
    return `${c.fullname}`;
}

export const formatCustomerMobileSubdivision = (c) => {
    if (!c) return '-';
    return `${c.subdivision}`;
}

export const formatCustomerMobilePhoneNumber = (c) => {
    if (!c) return '-';
    return `${c.phoneNumber}`;
}

export const formatDriver = (d) => {
    if (!d) return '-';
    return `${d.surname} ${d.name} ${d.middlename}\n${d.phoneNumber}`;
}

export const formatDriverMobileFullname = (d) => {
    if (!d) return '-';
    return `${d.surname} ${d.name} ${d.middlename}`;
}

export const formatDriverMobilePhoneNumber = (d) => {
    if (!d) return '-';
    return `${d.phoneNumber}`;
}

export const formatPlace = (p) => {
    if (!p) return '-';
    return `${p.name}`;
}

export const formatTransportNumber = (t) => {
    if (!t) return '-';
    return `${t.transportNumber}`
}

export const formatRole = (role) => {
    switch (role) {
        case "OPERATOR":
            return "Диспетчер";
        case "ADMIN":
            return "Администратор";
        case "WATCHER":
            return "Наблюдатель";
        case "DRIVER":
            return "Водитель";
        case "CUSTOMER":
            return "Заказчик";
    }
}