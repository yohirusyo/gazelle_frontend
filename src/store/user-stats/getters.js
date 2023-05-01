import dayjs from 'dayjs';

export const getShiftMinDate = (state) => () => {
    return dayjs(state.shiftMin).format('YYYY/MM/DD');
}

export const getShiftMaxDate = (state) => () => {

    return dayjs(state.shiftMax).format('YYYY/MM/DD');
}

export const getFilteredShiftStats = (state) => (/* fullname, subdivision */) => {
    return state.shiftStats
}

export const getOperatorShiftMinDate = (state) => () => {
    return dayjs(state.operatorShiftMin).format('YYYY/MM/DD');
}

export const getOperatorShiftMaxDate = (state) => () => {
    return dayjs(state.operatorShiftMax).format('YYYY/MM/DD');
}

export const getFilteredOperatorShiftStats = (state) => (/* fullname, subdivision */) => {
    return state.operatorShiftStats
}