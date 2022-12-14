<template>
  <q-table
    :rows="filteredOrders({ subdivisions: _selectedSubdivisions })"
    :columns="columns"
    row-key="time"
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
          {{ formatCustomerMobileSubdivision(getCustomerById(props.row.customerId)) }}
          <q-tooltip>
            {{ formatCustomerMobileFullname(getCustomerById(props.row.customerId)) }}
            {{ formatCustomerMobilePhoneNumber(getCustomerById(props.row.customerId)) }}
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

          <div
            class="column items-center justify-center"
            :class="swapped == props.row.id ? 'bg-yellow-4' : ''"
          >
            <q-btn
              dense
              flat
              @click.prevent.stop="swapPriority({ firstId: findNextOrder(filteredOrders({ subdivisions: _selectedSubdivisions }), props.row).id, secondId: props.row.id })"
              icon="las la-chevron-up"
              v-if="findNextOrder(filteredOrders({ subdivisions: _selectedSubdivisions }), props.row)"
              @mouseover="swapped = findNextOrder(filteredOrders({ subdivisions: _selectedSubdivisions }), props.row)?.id"
              @mouseleave="swapped = null"
            >
              <q-tooltip>
                Поднять приоритет
              </q-tooltip>
            </q-btn>
            <q-btn
              dense
              flat
              @click.prevent.stop="swapPriority({ firstId: findPrevOrder(filteredOrders({ subdivisions: _selectedSubdivisions }), props.row).id, secondId: props.row.id })"
              icon="las la-chevron-down"
              v-if="findPrevOrder(filteredOrders({ subdivisions: _selectedSubdivisions }), props.row)"
              @mouseover="swapped = findPrevOrder(filteredOrders({ subdivisions: _selectedSubdivisions }), props.row)?.id"
              @mouseleave="swapped = null"
            >
              <q-tooltip>
                Опустить приоритет
              </q-tooltip>
            </q-btn>
          </div>
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
  formatContact,
  formatCustomer,
  formatCustomerMobileSubdivision,
  formatCustomerMobileFullname,
  formatCustomerMobilePhoneNumber,
  formatPlace,
  formatTransportNumber,
} from "src/helpers/formatters";
import AutoNumber from "../base/AutoNumber.vue";
import order from "src/store/order";
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
    ...mapGetters('status', ['getStatusById'])
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
      swapped: null,
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
    ...mapActions('order', ['swapPriority']),
    timeFormat,
    formatContact,
    formatCustomer,
    formatPlace,
    formatTransportNumber,
    formatCustomerMobileSubdivision,
    formatCustomerMobileFullname,
    formatCustomerMobilePhoneNumber,
    findNextOrder(orders, order) {
      if (['ACCEPTED', 'ENTRY_TO_CUSTOMER', 'ENTRY_TO_DESTINATION', 'EXIT_TO_DESTINATION'].includes(this.getStatusById(order?.statusId)?.code)) return null;
      if (order?.isRequest && !order?.isApproved) return null;
      return orders?.findLast(o => {
        if (['ACCEPTED', 'ENTRY_TO_CUSTOMER', 'ENTRY_TO_DESTINATION', 'EXIT_TO_DESTINATION'].includes(this.getStatusById(o?.statusId)?.code) || (o?.isRequest && !o?.isApproved)) return false
        return o?.priority <= order?.priority && o?.id != order?.id
      })
    },
    findPrevOrder(orders, order) {
      if (['ACCEPTED', 'ENTRY_TO_CUSTOMER', 'ENTRY_TO_DESTINATION', 'EXIT_TO_DESTINATION'].includes(this.getStatusById(order?.statusId)?.code)) return null;
      if (order?.isRequest && !order?.isApproved) return null;
      return orders?.find(o => {
        if (['ACCEPTED', 'ENTRY_TO_CUSTOMER', 'ENTRY_TO_DESTINATION', 'EXIT_TO_DESTINATION'].includes(this.getStatusById(o?.statusId)?.code) || (o?.isRequest && !o?.isApproved)) return false
        return o?.priority >= order?.priority && o?.id != order?.id
      })
    }
  },
};
</script>
