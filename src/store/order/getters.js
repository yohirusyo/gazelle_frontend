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
  // if (dayjs(route.orders[0].createdAt).utc() < dayjs.unix(this._yesterdayTime))
  //   return 2;
  return 1;
};

const getCargoTypeById = (id, cargoTypes) => {
  return cargoTypes.find((ct) => ct.id == id);
};

const getCargoTypePriority = (route, cargoTypes) => {
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

const getCargoTypeTransportTypePriorityResult = (
  route,
  relatedCargoTypes,
  cargoTypes
) => {
  const test = getCargoTypePriorityWithCargoType(route, cargoTypes);
  const relatedCargoType = relatedCargoTypes.find(
    (rct) => rct.id === test?.cargoTypeId
  );
  return (
    relatedCargoType?.CargoTypeTransportTypeAssociation?.transportPriorityF ?? 0
  );
};

export const getMostPrioritizedRoute =
  (state) => (transportType, cargoTypes, relatedCargoTypes) => {
    const routes = state.orders
      // Отфильтровываем заявки с неназначенным ТС
      .filter((route) => !isWithTs(route))
      // Отфильтровываем маршруты обрабатываемые этим типом ТС
      .filter((route) => {
        // Самый приоритетный груз в маршруте
        const mvpRoute = getCargoTypePriorityWithCargoType(route, cargoTypes);
        // Проверка на то, что самый приоритетный груз обслуживается этим типом ТС
        return relatedCargoTypes
          .filter((ct) =>
            [3].includes(
              // Просьба Андрея обслуживать только высокий приоритет в привязке Тип груза к типу ТС, если нужно обрабатывать любой груз поставить [3,2,1] или убрать этот фильтр
              ct?.CargoTypeTransportTypeAssociation?.transportPriorityF ?? 0
            )
          )
          .map((ct) => ct.id)
          .includes(mvpRoute.cargoTypeId);
      })
      // Сортируем
      .sort((a, b) => {
        const aRoutePriorityResult = getRoutePriority(a); // Приоритет маршрута (3 аварийный, 2 плановый, 1 обычный)
        const bRoutePriorityResult = getRoutePriority(b);

        if (aRoutePriorityResult > bRoutePriorityResult) return -1;
        if (bRoutePriorityResult > aRoutePriorityResult) return 1;

        const aCargoTypeResult = getCargoTypePriority(a, cargoTypes); // Приортитет типа груза
        const bCargoTypeResult = getCargoTypePriority(b, cargoTypes);

        if (aCargoTypeResult > bCargoTypeResult) return -1;
        if (bCargoTypeResult > aCargoTypeResult) return 1;

        const aCargoTypeTransportTypePriorityResult = // Приоритет связки тип груза тип ТС
          getCargoTypeTransportTypePriorityResult(
            a,
            relatedCargoTypes,
            cargoTypes
          );
        const bCargoTypeTransportTypePriorityResult =
          getCargoTypeTransportTypePriorityResult(
            b,
            relatedCargoTypes,
            cargoTypes
          );

        if (
          aCargoTypeTransportTypePriorityResult >
          bCargoTypeTransportTypePriorityResult
        )
          return -1;
        if (
          bCargoTypeTransportTypePriorityResult >
          aCargoTypeTransportTypePriorityResult
        )
          return 1;

        return 0;
      });
    return routes?.[0] ?? null;
  };
