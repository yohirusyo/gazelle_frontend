export function setAllControlLimits(state, controlLimits) {
  state.controlLimits = controlLimits;
}

export function setMonthLimitSubdivisions(state, monthLimitSubdivisions) {
  state.monthLimitSubdivisions = monthLimitSubdivisions;
}

export function setLimit(state, val) {
  state.monthLimitSubdivisions.forEach((item) => {
    if (item.id === val.id) {
      item[val.string] = Number(val.value)
    }
  });
  console.log(state);
}
