import * as moment from 'moment';

export const getShiftMinDate = (state) => () => {
    return moment(state.shiftMin).format('YYYY/MM/DD');
}

export const getShiftMaxDate = (state) => () => {

    return moment(state.shiftMax).format('YYYY/MM/DD');
}

export const getFilteredShiftStats = (state) => (/* fullname, subdivision */) => {
    return state.shiftStats
}

export const getOperatorShiftMinDate = (state) => () => {
    return moment(state.operatorShiftMin).format('YYYY/MM/DD');
}

export const getOperatorShiftMaxDate = (state) => () => {
    return moment(state.operatorShiftMax).format('YYYY/MM/DD');
}

export const getFilteredOperatorShiftStats = (state) => (/* fullname, subdivision */) => {
    return state.operatorShiftStats
}