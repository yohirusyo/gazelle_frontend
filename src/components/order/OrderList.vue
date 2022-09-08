<template>
  <div class="row items-center col col-shrink q-pr-md">
    <div class="col-2 text-center">Время подачи</div>
    <div class="col-2">Заказчик</div>
    <div class="col-2">Контактное лицо</div>
    <div class="col-2">Место отправления</div>
    <div class="col-2">Место назначения</div>
    <div class="col-2 text-center">Номер ТС</div>
  </div>
  <q-separator spaced />
  <q-scroll-area class="col q-pr-md">
    <div v-for="order in orders" :key="order.id" @click="setOrder(order)">
      <div class="row items-center">
        <div class="col-2 text-center">
          <span :class="order.isEmergency ? 'bg-red text-white' : ''">
            {{ timeFormat(order?.orderTime) }}
          </span>
        </div>
        <div class="col-2 pre">
          {{ formatCustomer(getCustomerById(order.customerId)) }}
        </div>
        <div class="col-2 pre">
          {{ formatContact(getContactById(order.contactId)) }}
        </div>
        <div class="col-2">
          {{ formatPlace(getPlaceById(order.departurePointId)) }}
        </div>
        <div class="col-2">
          {{ formatPlace(getPlaceById(order.destinationId)) }}
        </div>
        <div class="col-2 text-center">
          {{ formatTransportNumber(getTransportById(order.transportId)) }}
        </div>
      </div>
      <q-tooltip>
        Наименование груза: {{ order.name }}
        <br />
        Описание: {{ order.description }}
      </q-tooltip>
      <q-separator spaced inset />
    </div>
  </q-scroll-area>
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
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
