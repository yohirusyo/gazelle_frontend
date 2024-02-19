import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const getFilteredNames = (state) => (name) => {
  const data =
    !!name && name != ""
      ? state.names.filter((subdivision) =>
          subdivision.toLowerCase().includes(name.toLowerCase())
        )
      : state.names;
  return data;
};

export const getOrderById = (state) => (id) =>
  state.orders.find((order) => order.id === id);

export const subdivisions = (state, getters, rootState) => {
  return [
    ...new Set(
      state.orders
        .map(
          (order) =>
            rootState.customer.customers.find((c) => c.id == order.customerId)
              ?.subdivision
        )
        .filter((s) => s != null)
    ),
  ];
};

export const filteredOrders =
  (state, getters, rootState, rootGetters) =>
  ({ subdivisions }) => {
    const busyStatuses = rootGetters["status/getBusyStatusesCodes"]();
    return state.orders
      .filter((o) => {
        if (o.parentOrder != o.id && o.parentOrder != null) return false;
        const sub = rootState.customer.customers.find(
          (c) => c.id == o.customerId
        )?.subdivision;
        if (subdivisions && !subdivisions.includes(sub)) return false;
        return true;
      })
      .sort((a, b) => {
        const aBusy = busyStatuses.includes(
          rootGetters["status/getStatusById"](a.statusId).code
        );
        const bBusy = busyStatuses.includes(
          rootGetters["status/getStatusById"](b.statusId).code
        );
        if ((aBusy && bBusy) || (!aBusy && !bBusy)) return 0;
        else if (aBusy) return 1;
        return -1;
      });
  };

export const orderRoute = (state) => (orderId) => {
  return state.orders.filter(
    (o) =>
      o.parentOrder == orderId &&
      !o.isApproved &&
      o.isRequest &&
      !o.isDeclined &&
      o.id != orderId
  );
};

export const orderRouteFull = (state) => (orderId) => {
  return state.orders.filter(
    (o) => o.parentOrder == orderId && o.id != orderId
  );
};

export const isExpanded = (state) => (orderId) => {
  return state.expandedRoutes.includes(orderId);
};

export const ordersCustomers = (state) => {
  return [
    ...new Set(
      state.orders.map((order) => {
        return order.orders[0].customerId;
      })
    ),
  ];
};

const isWithTs = (route) => (route.orders[0].transportId ? 1 : 0);

const getRoutePriority = (route) => {
  if (route.orders[0].isEmergency) return 3;
  if (dayjs(route.orders[0].createdAt).utc() < dayjs.unix(this._yesterdayTime))
    return 2;
  return 1;
};

const getCargoTypeById = (id, cargoTypes) => {
  return cargoTypes.find((ct) => ct.id == id);
};

const getCargoTypePriority = (route) => {
  return route.orders.reduce((prev, curr) => {
    const currPriority =
      getCargoTypeById(curr.cargoTypeId, cargoTypes)?.priority ?? 1;
    return currPriority > prev ? currPriority : prev;
  }, 0);
};

const getCargoTypePriorityWithCargoType = (route, cargoTypes) => {
  return route.orders.reduce(
    (prev, curr) => {
      const currPriority =
        getCargoTypeById(curr.cargoTypeId, cargoTypes)?.priority ?? 1;
      return currPriority > prev.priority
        ? { priority: currPriority, cargoTypeId: curr.cargoTypeId }
        : prev;
    },
    { priority: 0, cargoTypeId: null }
  );
};

const getCargoTypeTransportTypePriorityResult = (route, relatedCargoTypes) => {
  const [_, cargoTypeId] = getCargoTypePriorityWithCargoType(route);
  const relatedCargoType = relatedCargoTypes.find(
    (rct) => rct.id === cargoTypeId
  );
  return (
    relatedCargoType?.CargoTypeTransportTypeAssociation?.transportPriorityF ?? 0
  );
};

export const getMostPrioritizedRoute =
  (state) => (transportType, cargoTypes, relatedCargoTypes) => {
    const routes = state.orders
      .filter((route) => !isWithTs(route))
      .filter((route) => {
        const test = getCargoTypePriorityWithCargoType(route, cargoTypes);
        console.warn(test);
        return relatedCargoTypes.map((ct) => ct.id).includes(test.cargoTypeId);
      })
      .sort((a, b) => {
        // const aTsResult = isWithTs(a);
        // const bTsResult = isWithTs(b);

        // if (aTsResult > bTsResult) return 1;
        // if (bTsResult > aTsResult) return -1;

        const aRoutePriorityResult = getRoutePriority(a);
        const bRoutePriorityResult = getRoutePriority(b);

        if (aRoutePriorityResult > bRoutePriorityResult) return -1;
        if (bRoutePriorityResult > aRoutePriorityResult) return 1;

        const aCargoTypeResult = getCargoTypePriority(a, cargoTypes);
        const bCargoTypeResult = getCargoTypePriority(b, cargoTypes);

        if (aCargoTypeResult > bCargoTypeResult) return -1;
        if (bCargoTypeResult > aCargoTypeResult) return 1;

        const aCargoTypeTransportTypePriorityResult =
          getCargoTypeTransportTypePriorityResult(a, relatedCargoTypes);
        const bCargoTypeTransportTypePriorityResult =
          getCargoTypeTransportTypePriorityResult(b, relatedCargoTypes);

        return orderTimeResult;
      });
    return routes?.[0] ?? null;
  };
