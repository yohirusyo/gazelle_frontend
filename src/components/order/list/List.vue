<template>
  <VScrolltable
    :rows="_orderList"
    :columns="_columns"
    row-key="id"
    ref="scroll"
  >
    <template v-slot:header-cell-customer="props">
      <q-th :props="props">
        {{ props.col.label }}
        <CustomerFilter />
      </q-th>
    </template>
    <template v-slot:body="props">
      <RouteElement
        :props="props"
        @onSelected="onSelected"
        :yesterdayTime="_yesterdayTime"
        :cargoTypes="cargoTypes"
      />
    </template>
  </VScrolltable>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import RouteElement from "./element/Element.vue";
import CustomerFilter from "./element/filters/Customer.vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import VScrolltable from "src/components/base/VScrolltable.vue";
import { getConnection } from "src/boot/axios";
export default {
  name: "OrderList",
  props: ["col", "height", "twoHoursToStart", "cargoTypes", "prioritySort"],
  components: {
    RouteElement,
    CustomerFilter,
    VScrolltable,
  },
  computed: {
    ...mapState("order", ["orders", "hovered", "selectedCustomers"]),
    ...mapGetters("order", [
      "subdivisions",
      "filteredOrders",
      "orderRouteFull",
    ]),
    ...mapState("current", ["hoveredTransportId"]),
    ...mapState("current", ["currentUser"]),
    ...mapGetters("status", ["getStatusById", "getBusyStatusesCodes"]),
    _orderList: {
      get() {
        const filtered = this.orders;
        return filtered
          .filter((o) => {
            return (
              ((this.twoHoursToStart &&
                new Date(o.orderTime) < this._timerActives) ||
                !this.twoHoursToStart) &&
              (this.selectedCustomers.length == 0 ||
                this.selectedCustomers.includes(o.orders[0].customerId))
            );
          })
          .sort((a, b) => {
            const aTsResult = this.isWithTs(a);
            const bTsResult = this.isWithTs(b);

            if (aTsResult > bTsResult) return 1;
            if (bTsResult > aTsResult) return -1;

            const orderTimeResult =
              b.orders[0].orderTime - a.orders[0].orderTime;
            if (!this.prioritySort) return orderTimeResult;

            const aRoutePriorityResult = this.getRoutePriority(a);
            const bRoutePriorityResult = this.getRoutePriority(b);

            if (aRoutePriorityResult > bRoutePriorityResult) return -1;
            if (bRoutePriorityResult > aRoutePriorityResult) return 1;

            const aCargoTypeResult = this.getCargoTypePriority(a);
            const bCargoTypeResult = this.getCargoTypePriority(b);

            if (aCargoTypeResult > bCargoTypeResult) return -1;
            if (bCargoTypeResult > aCargoTypeResult) return 1;

            return orderTimeResult;
          });
      },
    },
    _hoveredOrder: {
      get() {
        return this.hovered;
      },
      set(val) {
        this.setHovered(val);
      },
    },
    _isMetiz: {
      get() {
        return getConnection() == "mmkmetiz";
      },
    },
    _columns: {
      get() {
        if (!this._isMetiz) return this.columns;
        return [
          ...this.columns,
          {
            name: "cargoPriority",
            required: true,
            label: "ПГ",
            align: "center",
            sortable: false,
          },
        ];
      },
    },
  },
  mounted() {
    this._selectedSubdivisions = this.subdivisions;
    this.updateActivesInterval();
    setInterval(this.updateActivesInterval, 60000);
  },

  watch: {
    subdivisions(newSubdivisions) {
      for (let s of newSubdivisions) {
        if (!this._selectedSubdivisions.includes(s)) {
          this._selectedSubdivisions.push(s);
        }
      }
    },
    hoveredTransportId(_) {
      if (this.hoveredTransportId == null) {
        this._hoveredOrder = null;
      } else {
        const busyStatuses = this.getBusyStatusesCodes();
        const fOrders = this.orders.filter((route) => {
          return route.orders.some(
            (order) => order.transportId == this.hoveredTransportId
          );
        });
        if (fOrders.length == 0) return (this._hoveredOrder = null);
        this._hoveredOrder = fOrders.reduce((prev, current) => {
          if (
            prev.orders.some((o) =>
              busyStatuses.includes(this.getStatusById(o.statusId).code)
            )
          )
            return prev;
          if (
            current.orders.some((o) =>
              busyStatuses.includes(this.getStatusById(o.statusId).code)
            )
          )
            return current;
          return prev.createdAt < current.createdAt ? prev : current;
        }, fOrders[0]);
        const scrollTo = this._orderList.findIndex(
          (o) => o.id == this._hoveredOrder.id
        );
        this.$refs.scroll.scrollTo(scrollTo);
      }
    },
  },
  data() {
    return {
      _selectedSubdivisions: [],
      _timerActives: null,
      _yesterdayTime: null,
      columns: [
        {
          name: "expand",
          required: true,
          label: "Маршрут",
          align: "center",
          sortable: false,
        },
        {
          name: "time",
          required: true,
          label: "Время подачи",
          align: "center",
          sortable: false,
        },
        {
          name: "customer",
          required: true,
          label: "Ответственный",
          align: "center",
          sortable: false,
        },

        {
          name: "departurePoint",
          required: true,
          label: "Место отправления",
          align: "center",
          sortable: false,
        },
        {
          name: "destination",
          required: true,
          label: "Место назначения",
          align: "center",
          sortable: false,
        },
        {
          name: "transportId",
          required: false,
          label: "Номер ТС",
          align: "center",
          sortable: false,
        },
        {
          name: "status",
          required: false,
          label: "Статус",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
  methods: {
    ...mapActions("order", ["swapPriority"]),
    ...mapMutations("order", ["setHovered"]),
    updateActivesInterval() {
      this._timerActives = Date.now() + 7200000;
      this._yesterdayTime = dayjs()
        .subtract(1, "day")
        .set("hour", 14)
        .set("minute", 0)
        .set("second", 0)
        .set("millisecond", 0)
        .utc()
        .unix();
    },
    onSelected(sel) {
      this.$emit("onSelected", sel);
    },
    getCargoTypeById(id) {
      return this.cargoTypes.find((ct) => ct.id == id);
    },
    getCargoTypePriority(route) {
      return route.orders.reduce((prev, curr) => {
        const currPriority =
          this.getCargoTypeById(curr.cargoTypeId)?.priority ?? 1;
        return currPriority > prev ? currPriority : prev;
      }, 0);
    },
    getRoutePriority(route) {
      if (route.orders[0].isEmergency) return 3;
      if (
        dayjs(route.orders[0].createdAt).utc() < dayjs.unix(this._yesterdayTime)
      )
        return 2;
      return 1;
    },
    isWithTs(route) {
      return route.orders[0].transportId ? 1 : 0;
    },
  },
};
</script>
