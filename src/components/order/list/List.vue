<template>
  <q-table
    :rows="_orderList"
    :columns="columns"
    row-key="id"
    wrap-cells
    virtual-scroll
    :rows-per-page-options="[0]"
    hide-bottom
    style="height: 100%"
    ref="scroll"
    flat
    class="my-sticky-header-table"
    dense
    table-header-class="bg-white"
    square
    separator="cell"
    id="order-list"
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
      />
    </template>
  </q-table>
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
export default {
  name: "OrderList",
  props: ["col", "height", "twoHoursToStart"],
  components: {
    RouteElement,
    CustomerFilter,
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
    ...mapGetters("status", ["getStatusById"]),
    _orderList: {
      get() {
        // const filtered = this.filteredOrders({
        //   subdivisions: this._selectedSubdivisions,
        // })
        const filtered = this.orders;
        return filtered.filter((o) => {
          return (
            ((this.twoHoursToStart &&
              new Date(o.orderTime) < this._timerActives) ||
              !this.twoHoursToStart) &&
            (this.selectedCustomers.length == 0 ||
              this.selectedCustomers.includes(o.orders[0].customerId))
          );
        });
        // return filtered;
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
        const busyStatuses = [
          "ACCEPTED",
          "ENTRY_TO_CUSTOMER",
          "ENTRY_TO_DESTINATION",
          "EXIT_TO_DESTINATION",
        ];
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
  },
};
</script>
