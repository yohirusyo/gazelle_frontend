import dayjs from "dayjs";

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
  console.log(val);
  state.monthLimitSubdivisions.forEach((item) => {
    if (item.id === val.id) {
      item[val.string] = Number(val.value);
      val.string === "percentage"
        ? (item.fact = val.scope)
        : (item.fact = val.value);
    }
  });
}

export function setTechnologicalTransportLimit(state, val) {
  state.monthLimitSubdivisions.forEach((item) => {
    if (item.id === val.id) {
      item[val.string] = Number(val.value);
    }
  });
}

export function setStatsControl(state, val) {
  val.forEach(function (x) {
    x.orderTime = dayjs(x.orderTime).format("DD.MM.YYYY");
    x.routeLength = x.routeLength / 1000;
  });
  state.statsControl = val;
}

export function setHoursStatsControl(state, val) {
  state.statsHoursControl = val;
}

export function setAllControlLimitsWithFactVolume(state, val) {
  state.monthLimitSubdivisions.forEach((m) => {
    m.fact = val * m.percentage / 100
  });
}

export function getLimitTransfer(state, val) {
  state.getTransferLimits = val;
}
// getLimitTransfer