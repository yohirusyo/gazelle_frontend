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
        <!-- <q-icon
          name="las la-filter"
          size="1.5em"
        >
          <q-menu persistent>
            <q-list style="min-width: 100px">
              <q-item
                style="user-select: none"
                clickable
                v-for="s of subdivisions"
                :class="_selectedSubdivisions.includes(s) ? 'bg-blue-2' : ''"
                @click="
                  _selectedSubdivisions.includes(s)
                    ? _selectedSubdivisions.splice(
                      _selectedSubdivisions.indexOf(s),
                      1
                    )
                    : _selectedSubdivisions.push(s)
                "
                :key="s"
              >
                <q-item-section>{{ s }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon> -->
      </q-th>
    </template>
    <template v-slot:body="props">
      <RouteElement :props="props" @onSelected="onSelected"/>

    </template>
  </q-table>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
// import Sortable from "sortablejs";
import RouteElement from "./OrderListElement/RouteElement.vue";
export default {
  name: "OrderList",
  props: ["col", "height"],
  components: {
    RouteElement
  },
  computed: {
    ...mapState("order", ["orders", 'hovered']),
    ...mapGetters("order", ["subdivisions", "filteredOrders", 'orderRouteFull']),
    ...mapState("current", ["hoveredTransportId"]),
    ...mapState("current", ["currentUser"]),
    ...mapGetters('status', ['getStatusById']),
    _orderList: {
      get() {
        // const filtered = this.filteredOrders({
        //   subdivisions: this._selectedSubdivisions,
        // })
        const filtered = this.orders;
        return filtered.filter(o => {
          return new Date(o.orderTime) < this._timerActives;
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
      }
    }
  },
  mounted() {
    this._selectedSubdivisions = this.subdivisions;
    this.updateActivesInterval();
    setInterval(this.updateActivesInterval, 60000)
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
        const fOrders = this.orders.filter(
          (route) => {
            return route.orders.some(order => order.transportId == this.hoveredTransportId)
          }
        );
        if (fOrders.length == 0) return (this._hoveredOrder = null);
        this._hoveredOrder = fOrders.reduce((prev, current) => {
          if (prev.orders.some(o => busyStatuses.includes(this.getStatusById(o.statusId).code)))
          return prev;
          if (current.orders.some(o => busyStatuses.includes(this.getStatusById(o.statusId).code)))
          return current;
          return prev.createdAt < current.createdAt ? prev : current;
        }, fOrders[0]);
        const scrollTo = this._orderList.findIndex((o) => o.id == this._hoveredOrder.id);
        this.$refs.scroll.scrollTo(scrollTo);
      }
    },
  },
  data() {
    return {
      _selectedSubdivisions: [],
      _timerActives: null,
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
        }
      ],
    };
  },
  methods: {
    ...mapActions("order", ["swapPriority"]),
    ...mapMutations('order', ['setHovered']),
    updateActivesInterval() {
      this._timerActives = Date.now() + 7200000;
    },
    onSelected(sel) {
      this.$emit('onSelected', sel);
    }
  },
};
</script>
