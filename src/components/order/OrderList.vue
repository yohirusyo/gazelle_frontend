<template>
  <q-table
    :rows="filteredOrders({ subdivisions: _selectedSubdivisions })"
    :columns="columns"
    row-key="time"
    wrap-cells
    virtual-scroll
    :rows-per-page-options="[0]"
    hide-bottom
    :style="`height: ${height}px`"
    ref="scroll"
    flat
    class="my-sticky-header-table"
    dense
    table-header-class="bg-white"
    square
    separator="cell"
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
                style="user-select: none;"
                clickable
                v-for="s of subdivisions"
                :class="_selectedSubdivisions.includes(s) ? 'bg-blue-2' : ''"
                @click="_selectedSubdivisions.includes(s) ? _selectedSubdivisions.splice(_selectedSubdivisions.indexOf(s), 1) : _selectedSubdivisions.push(s)"
              >
                <q-item-section>{{ s }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </q-th>
    </template>
    <template v-slot:body="props">
      <q-tr
        :props="props"
        :class="
          _hoveredOrder?.id == props.row.id
            ? 'bg-light-green-2'
            : props.row.isRequest && !props.row.isApproved
              ? 'bg-blue-2'
              : props.row.isRequest && props.row.isApproved
                ? 'bg-blue-1'
                : ''
        "
        @click="setOrder(props.row)"
      >
        <q-td
          key="time"
          :props="props"
        >
          <div class="col-2 text-center column items-center">
            <span>
              {{ "№ " + props.row.id }}
            </span>
            <q-chip
              class="q-ma-none"
              :class="props.row.isEmergency ? 'bg-red text-white' : ''"
            >
              {{
                  props.row?.orderTime
                    ? timeFormat(props.row?.orderTime)
                    : "Маршрут"
              }}
            </q-chip>
          </div>
          <q-tooltip>
            <span>Наименование груза: {{ props.row.name }}</span>
            <br v-if="props.row.description && props.row.description != ''" />
            <span v-if="props.row.description && props.row.description != ''">Описание: {{ props.row.description
            }}</span>
          </q-tooltip>
        </q-td>
        <q-td
          key="customer"
          :props="props"
          class="pre"
        >
          {{ formatCustomer(getCustomerById(props.row.customerId)) }}
        </q-td>

        <q-td
          key="departurePoint"
          :props="props"
        >
          {{ formatPlace(getPlaceById(props.row.departurePointId)) }}
        </q-td>
        <q-td
          key="destination"
          :props="props"
        >
          {{ formatPlace(getPlaceById(props.row.destinationId)) }}
        </q-td>

        <q-td
          key="transportId"
          :props="props"
        >
          <div
            class="row justify-center"
            v-if="props.row.transportId"
          >
            <AutoNumber :number="
              formatTransportNumber(getTransportById(props.row.transportId))
            " />
          </div>
          <div v-else>Транспорт не выбран!</div>
        </q-td>
        <q-td
          key="status"
          :props="props"
        >
          <OrderStatus :orderId="props.row.id" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import OrderStatus from "./OrderStatus.vue";
import {
  timeFormat,
  formatContact,
  formatCustomer,
  formatPlace,
  formatTransportNumber,
} from "src/helpers/formatters";
import AutoNumber from "../base/AutoNumber.vue";
export default {
  name: "OrderList",
  props: ["col", "height"],
  components: {
    AutoNumber,
    OrderStatus,
  },
  computed: {
    ...mapState("order", ["orders"]),
    ...mapGetters("order", ["subdivisions", "filteredOrders"]),
    ...mapGetters("contact", ["getContactById"]),
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("transport", ["getTransportById"]),
    ...mapState("current", ["hoveredTransportId"]),
    ...mapState("current", ["currentUser"]),
  },
  mounted() {
    this._selectedSubdivisions = this.subdivisions;
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
        const fOrders = this.orders.filter(
          (order) => order.transportId == this.hoveredTransportId
        );
        if (fOrders.length == 0) return (this._hoveredOrder = null);
        this._hoveredOrder = fOrders.reduce(function (prev, current) {
          return prev.createdAt < current?.createdAt ? prev : current;
        }, fOrders[0]);
        const scrollTo = this.orders.findIndex(
          (o) => o.id == this._hoveredOrder.id
        );
        this.$refs.scroll.scrollTo(scrollTo);
      }
    },
  },
  data() {
    return {
      _hoveredOrder: null,
      _selectedSubdivisions: [],
      columns: [
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
    ...mapMutations("current", ["setOrder"]),
    timeFormat,
    formatContact,
    formatCustomer,
    formatPlace,
    formatTransportNumber,
  },
};
</script>

