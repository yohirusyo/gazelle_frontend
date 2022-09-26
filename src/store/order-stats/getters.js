import * as moment from 'moment';
export const statsSubidivisions = (state) => {
    const orders = state.orderStats.map(os => os.order);
    const customers = orders.map(order => order.customer);
    const subdivisions = customers.map(customer => customer.subdivision);
    return [...new Set(subdivisions)]
}

export const driversFullnames = (state) => {
    const driversFullnames = state.orderStats.map(os => os.driverFullname);
    return [...new Set(driversFullnames)]
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
        if (
            ((!fullname || fullname == '') || (fullname && os.driverFullname.toLowerCase().includes(fullname.toLowerCase()))) &&
            ((!subdivision || subdivision == '') || (subdivision && os.order.customer.subdivision.toLowerCase().includes(subdivision.toLowerCase()))) &&
            ((!date || date == '') || (date && moment(os.order.orderTime).format('DD.MM.YYYY') == date))
        ) return true;
        return false;
    })
}