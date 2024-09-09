export function set(state, shiftStats) {
  state.shiftStats = shiftStats;
}

export function setMinMax(state, shiftMinMax) {
  state.shiftMin = shiftMinMax.min;
  state.shiftMax = shiftMinMax.max;
}

export function setOperator(state, shiftStats) {
  state.operatorShiftStats = shiftStats;
}

export function setMinMaxOperator(state, shiftMinMax) {
  state.operatorShiftMin = shiftMinMax.min;
  state.operatorShiftMax = shiftMinMax.max;
}

export function setDayDriverShift(state, dayDriverShift) {
  state.dayDriverShift = dayDriverShift;
}
