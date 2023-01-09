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
        :id="'order-list-item-' + props.row.id"
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
              class="q-mx-none q-mt-none "
              :class="props.row.isEmergency ? 'bg-red text-white' : ''"
            >
              <div> {{
                props.row?.orderTime
                  ? timeFormat(props.row?.orderTime)
                  : "Маршрут"
              }}
              </div>

            </q-chip>
            <q-chip
              class="q-mx-none q-mt-none "
              style="font-size: 0.75rem"
              v-if="timeFormatOrder(props.row?.orderTime)"
            >
              <div>
                {{ timeFormatOrder(props.row?.orderTime) }}
              </div>
            </q-chip>
          </div>
          <q-tooltip>
            <span>Наименование груза: {{ props.row.name }}</span>
            <br v-if="props.row.description && props.row.description != ''" />
            <span v-if="props.row.description && props.row.description != ''">Описание: {{
              props.row.description
            }}</span>
          </q-tooltip>
        </q-td>
        <q-td
          key="customer"
          :props="props"
          class="pre"
        >
          {{
  formatCustomerMobileSubdivision(
    getCustomerById(props.row.customerId)
)
          }}
          <q-tooltip>
            {{
  formatCustomerMobileFullname(
    getCustomerById(props.row.customerId)
)
            }}
            {{
  formatCustomerMobilePhoneNumber(
    getCustomerById(props.row.customerId)
)
            }}
          </q-tooltip>
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
        <q-td
          key="priority"
          :props="props"
        >
          <OrderPriority :orderId="props.row.id" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import OrderStatus from "./OrderStatus.vue";
import {
  timeFormat,
  timeFormatOrder,
  formatContact,
  formatCustomer,
  formatCustomerMobileSubdivision,
  formatCustomerMobileFullname,
  formatCustomerMobilePhoneNumber,
  formatPlace,
  formatTransportNumber,
} from "src/helpers/formatters";
import AutoNumber from "../base/AutoNumber.vue";
import OrderPriority from "./OrderPriority.vue";
import Sortable from "sortablejs";
export default {
  name: "OrderList",
  props: ["col", "height"],
  components: {
    AutoNumber,
    OrderStatus,
    OrderPriority,
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
    ...mapGetters("status", ["getStatusById"]),
    _orderList: {
      get() {
        return this.filteredOrders({
          subdivisions: this._selectedSubdivisions,
        }).filter(o => new Date(o.orderTime) < this._timerActives);
      },
    },
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
    console.warn(this._timerActives);
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
      _rerenderCounter: 0,
      _hoveredOrder: null,
      _selectedSubdivisions: [],
      swapped: null,
      _timerActives: null,
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
    ...mapMutations("current", ["setOrder"]),
    ...mapActions("order", ["rerender"]),
    ...mapActions("order", ["swapPriority"]),
    timeFormat,
    timeFormatOrder,
    formatContact,
    formatCustomer,
    formatPlace,
    formatTransportNumber,
    formatCustomerMobileSubdivision,
    formatCustomerMobileFullname,
    formatCustomerMobilePhoneNumber,
    updateActivesInterval() {
      this._timerActives = Date.now() + 7200000;
    }
  },
};
</script>
