import dayjs from 'dayjs';
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
    return dayjs(state.min).format('YYYY/MM/DD');
}

export const getMaxDate = (state) => () => {

    return dayjs(state.max).format('YYYY/MM/DD');
}

export const getFilteredStats = (state) => (fullname, subdivision) => {
    return state.orderStats.filter(os => {
        if (
            ((!fullname || fullname == '') || (fullname && os.driverFullname.toLowerCase().includes(fullname.toLowerCase()))) &&
            ((!subdivision || subdivision == '') || (subdivision && os.order.customer.subdivision.toLowerCase().includes(subdivision.toLowerCase())))

        ) return true;
        return false;
    })
}