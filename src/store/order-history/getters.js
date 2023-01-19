import * as moment from 'moment';

export const getSortedHistory = (state) => (onlyMy) => {
    const stateHistory = onlyMy ? state.history.filter(o => o.order.customerId == onlyMy) : state.history
    const newHistory = [];
    for (let index = stateHistory.length - 1; index >= 0; index--) {
        if (index == stateHistory.length - 1) {
            newHistory.push({
                ...stateHistory[index],
                head: true,
            })

        } else {
            newHistory.push({
                ...stateHistory[index],
                head: !!moment(stateHistory[index].order.createdAt).format('YYYYMMDD').localeCompare(moment(stateHistory[index + 1].order.createdAt).format('YYYYMMDD')),
            })

        }
    }
    return newHistory;
}

export const getRequestById = (state) => (id) => {
    const item = state.history.find(item => item.orderId == id)
    return item;
}