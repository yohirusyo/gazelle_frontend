export function set(state, orderStats) {
  state.orderStats = orderStats;
}

export function setMinMax(state, minMax) {
  state.min = minMax.min;
  state.max = minMax.max;
}

export function setMvz(state, mvzStats) {
  delete mvzStats[3830200];
  state.mvzStats = mvzStats
}

export function setSubdivision(state, subdivisionStats) {
  state.subdivisionStats = subdivisionStats
}

export function setTime(state, timeStats) {
  state.timeStats = timeStats
}

export function setStatsIndicatorReport(state, indicatorStats) {
  state.indicatorStats = indicatorStats
}


