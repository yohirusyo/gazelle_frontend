import * as moment from 'moment';

export const getSortedHistory = (state) => () => {
    const newHistory = [];
    for (let index = state.history.length - 1; index >= 0; index--) {
        if (index == state.history.length - 1) {
            newHistory.push({
                ...state.history[index],
                head: true,
            })

        } else {
            newHistory.push({
                ...state.history[index],
                head: !!moment(state.history[index].order.createdAt).format('YYYYMMDD').localeCompare(moment(state.history[index + 1].order.createdAt).format('YYYYMMDD')),
            })

        }
    }
    return newHistory;
}

export const getRequestById = (state) => (id) => {
    const item = state.history.find(item => item.orderId == id)
    return item;
}