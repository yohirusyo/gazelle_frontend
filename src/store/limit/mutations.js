export function setAllControlLimits(state, controlLimits) {
  controlLimits.sort(function (a, b) {
    return a.year - b.year || a.month - b.month;
});
  state.controlLimits = controlLimits;
}

export function setMonthLimitSubdivisions(state, monthLimitSubdivisions) {
  state.monthLimitSubdivisions = monthLimitSubdivisions;
}

export function setLimit(state, val) {
  state.monthLimitSubdivisions.forEach((item) => {
    if (item.id === val.id) {
      item[val.string] = Number(val.value)
      val.string === 'percentage' ? item.fact = val.scope : item.fact = val.value
    }
  });
}
