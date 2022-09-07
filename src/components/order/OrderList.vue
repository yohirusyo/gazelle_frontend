<template>
  <div class="row items-center col col-shrink q-pr-md">
    <div class="col-1">Время подачи</div>
    <div class="col-3">Заказчик</div>
    <div class="col-3">Контактное лицо</div>
    <div class="col-2">Место отправления</div>
    <div class="col-2">Место назначения</div>
    <div class="col-1">Аварийная</div>
  </div>
  <q-separator spaced />
  <q-scroll-area class="col q-pr-md">
    <div v-for="order in orders" :key="order.id" @click="setOrder(order)">
      <div class="row items-center">
        <div class="col-1">{{ timeFormat(order?.orderTime) }}</div>
        <div class="col-3 pre">
          {{ formatCustomer(getCustomerById(order.customerId)) }}
        </div>
        <div class="col-3 pre">
          {{ formatContact(getContactById(order.contactId)) }}
        </div>
        <div class="col-2">
          {{ formatPlace(getPlaceById(order.departurePointId)) }}
        </div>
        <div class="col-2">
          {{ formatPlace(getPlaceById(order.destinationId)) }}
        </div>
        <div class="col-1">{{ order.isEmergency ? "Да" : "Нет" }}</div>
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
} from "src/helpers/formatters";
export default {
  name: "OrderList",
  computed: {
    ...mapState("order", ["orders"]),
    ...mapGetters("contact", ["getContactById"]),
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapGetters("place", ["getPlaceById"]),
  },
  methods: {
    ...mapActions("order", ["requestOrders"]),
    ...mapMutations("current", ["setOrder"]),
    timeFormat,
    formatContact,
    formatCustomer,
    formatPlace,
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
