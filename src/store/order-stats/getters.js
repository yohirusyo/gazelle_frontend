import * as moment from 'moment';
import order from '../order';

export const getStatsSubidivisions = (state) => (name) => {
    const orders = state.orderStats.map(os => os.order);
    const customers = orders.map(order => order.customer);
    const subdivisions = customers.map(customer => customer.subdivision);
    const data = [...new Set(subdivisions)]
    if (name == null || name == '') return data;
    return data.filter(n => n.toLowerCase().includes(name.toLowerCase()));
}

export const getDriversFullnames = (state) => (name) => {
    const driversFullnames = state.orderStats.map(os => os.driverFullname);
    const data = [...new Set(driversFullnames)]
    if (name == null || name == '') return data;
    return data.filter(n => n.toLowerCase().includes(name.toLowerCase()));
}

export const getMinDate = (state) => () => {
    const orders = state.orderStats.map(os => os.order);
    const dates = orders.map(o => new Date(o.orderTime))
    const minDate = Math.min(...dates);
    return moment(minDate).format('YYYY/MM/DD');
}

export const getMaxDate = (state) => () => {
    const orders = state.orderStats.map(os => os.order);
    const dates = orders.map(o => new Date(o.orderTime))
    const minDate = Math.max(...dates);
    return moment(minDate).format('YYYY/MM/DD');
}

export const getFilteredStats = (state) => (fullname, subdivision, date) => {
    return state.orderStats.filter(os => {
        console.warn(os.order.customer.subdivision)
        if (
            ((!fullname || fullname == '') || (fullname && os.driverFullname.toLowerCase().includes(fullname.toLowerCase()))) &&
            ((!subdivision || subdivision == '') || (subdivision && os.order.customer.subdivision.toLowerCase().includes(subdivision.toLowerCase()))) &&
            ((!date || date == '') || (date && moment(os.order.orderTime).format('DD.MM.YYYY') == date))
        ) return true;
        return false;
    })
}