<template>
  <div class="row items-center col col-shrink q-pr-md" ref="top">
    <div class="col-2 text-center">Время подачи</div>
    <div class="col-2">Ответственный</div>
    <div class="col-2">Контактное лицо</div>
    <div class="col-2">Место отправления</div>
    <div class="col-2">Место назначения</div>
    <div class="col-2 text-center">Номер ТС</div>
  </div>
  <q-separator class="q-ma-none" />
  <q-virtual-scroll :items="orders" separator v-slot="{ item }" :style="`height: ${height}px`" ref="scroll">
    <div :key="item.id" :class="_hoveredOrder?.id == item.id ? 'bg-light-green-2' : ''" @click="setOrder(item)">
      <div class="row items-center q-py-md">
        <div class="col-2 text-center column items-center">
          <span >
            {{ '№ ' + item.id }}
          </span>
          <q-chip class="q-ma-none" :class="item.isEmergency ? 'bg-red text-white' : ''">
            {{ timeFormat(item?.orderTime) }}
          </q-chip>
        </div>
        <div class="col-2 pre">
          {{ formatCustomer(getCustomerById(item.customerId)) }}
        </div>
        <div class="col-2 pre">
          {{ formatContact(getContactById(item.contactId)) }}
        </div>
        <div class="col-2">
          {{ formatPlace(getPlaceById(item.departurePointId)) }}
        </div>
        <div class="col-2">
          {{ formatPlace(getPlaceById(item.destinationId)) }}
        </div>
        <div class="col-2 text-center gosnumber">
          {{ formatTransportNumber(getTransportById(item.transportId)) }}
        </div>
      </div>
      <q-tooltip>
        Наименование груза: {{ item.name }}
        <br />
        Описание: {{ item.description }}
      </q-tooltip>
      <q-separator class="q-ma-none" />
    </div>
  </q-virtual-scroll>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import {
  timeFormat,
  formatContact,
  formatCustomer,
  formatPlace,
  formatTransportNumber,
} from "src/helpers/formatters";
export default {
  name: "OrderList",
  computed: {
    ...mapState("order", ["orders"]),
    ...mapGetters("contact", ["getContactById"]),
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("transport", ["getTransportById"]),
    ...mapState("current", [
      "hoveredTransportId"
    ]),

  },
  watch: {
    hoveredTransportId(_) {
      if (this.hoveredTransportId == null) {
        this._hoveredOrder = null;
      } else {
        const fOrders = this.orders.filter(order => order.transportId == this.hoveredTransportId)
        if (fOrders.length == 0) return this._hoveredOrder = null;
        this._hoveredOrder = fOrders.reduce(function (prev, current) {
          return (prev.createdAt < current?.createdAt) ? prev : current
        }, fOrders[0])
        const scrollTo = this.orders.findIndex(o => o.id == this._hoveredOrder.id)
        this.$refs.scroll.scrollTo(scrollTo)
      }
    }
  },
  data() {
    return {
      height: 0,
      _hoveredOrder: null,
    };
  },
  methods: {
    ...mapActions("order", ["requestOrders"]),
    ...mapMutations("current", ["setOrder"]),
    timeFormat,
    formatContact,
    formatCustomer,
    formatPlace,
    formatTransportNumber,
  },
  async mounted() {
    await this.requestOrders();
    this.height =
      document.getElementsByClassName("ymap-container")[0]?.clientHeight - this.$refs.top.clientHeight - 25;
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
