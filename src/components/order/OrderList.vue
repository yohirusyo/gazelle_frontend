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
        <q-icon
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
        </q-icon>
      </q-th>
    </template>
    <template v-slot:body="props">
      <OrderListElement
        :props="props"
        @onSelected="onSelected"
      />
      <OrderListElement
        v-for="o of orderRouteFull(props.row.id)"
        :key="o.id"
        :props="{ ...props, row: o }"
        v-if="props.expand || _hoveredOrder?.id == props.row.id"
        @onSelected="onSelected"
      />
    </template>
  </q-table>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import Sortable from "sortablejs";
import OrderListElement from "./OrderListElement/OrderListElement.vue";
export default {
  name: "OrderList",
  props: ["col", "height"],
  components: {
    OrderListElement
  },
  computed: {
    ...mapState("order", ["orders", 'hovered']),
    ...mapGetters("order", ["subdivisions", "filteredOrders", 'orderRouteFull']),
    ...mapState("current", ["hoveredTransportId"]),
    ...mapState("current", ["currentUser"]),
    ...mapGetters('status', ['getStatusById']),
    _orderList: {
      get() {
        const filtered = this.filteredOrders({
          subdivisions: this._selectedSubdivisions,
        })
        return filtered.filter(o => {
          if (!o.orderTime) {
            const parent = filtered.find(or => or.id == o.parentOrder);
            if (!parent) return true;
            else {
              return new Date(parent.orderTime) < this._timerActives
            }
          } else {
            return new Date(o.orderTime) < this._timerActives;
            // return true;
          }
        });
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
    const element = document.querySelector(
      "#order-list .q-virtual-scroll__content"
    );
    const self = this;
    const sortable = Sortable.create(element, {
      async onEnd(event) {
        await self.swapPriority({
          firstId: self._orderList[event.newIndex].id,
          secondId: self._orderList[event.oldIndex].id,
        });
      },
      filter: ".ignore-elements",
    });
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
          (order) => order.transportId == this.hoveredTransportId
        );
        if (fOrders.length == 0) return (this._hoveredOrder = null);
        this._hoveredOrder = fOrders.reduce((prev, current) => {
          if (busyStatuses.includes(this.getStatusById(prev.statusId).code))
            return prev;
          if (busyStatuses.includes(this.getStatusById(current.statusId).code))
            return current;
          return prev.priority < current?.priority ? prev : current;
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
        },
        {
          name: "priority",
          required: false,
          label: "",
          align: "center",
          sortable: false,
        },
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
