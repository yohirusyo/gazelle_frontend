<template>
  <div :style="`height: 100%`" class="q-gutter-y-sm">
    <div
      class="column"
      v-for="order of orders"
      :key="order.id"
      @click="setOrder(order)"
      :class="
        order.isRequest && !order.isApproved
          ? 'bg-blue-2 '
          : order.isRequest && order.isApproved
          ? 'bg-blue-1 '
          : 'bg-white '
      "
    >
      <div class="row justify-evenly">
        <q-chip>
          {{ order.id }}
        </q-chip>
        <q-chip :class="order.isEmergency ? 'bg-red text-white' : ''">
          {{ order?.orderTime ? timeFormat(order?.orderTime) : "Маршрут" }}
        </q-chip>
      </div>

      <div class="row justify-center">
        <AutoNumber
          v-if="order.transportId"
          :number="formatTransportNumber(getTransportById(order.transportId))"
        />
        <div class="q-pa-xs" v-else>Транспорт не выбран!</div>
      </div>

      <div class="row justify-center">
        <OrderStatus :orderId="order.id" />
      </div>

      <div class="column items-center">
        <div class="row">
          {{ formatCustomerMobileFullname(getCustomerById(order.customerId)) }}

          {{
            formatCustomerMobileSubdivision(getCustomerById(order.customerId))
          }}
        </div>
        <div class="row text-grey items-center">
          <q-icon name="phone" />
          {{
            formatCustomerMobilePhoneNumber(getCustomerById(order.customerId))
          }}
        </div>
      </div>

      <div class="column justify-center items-center">
        <div class="row">
          {{ order.name }}
        </div>
        <div class="row text-grey">
          {{ order.description ? order.description : "" }}
        </div>
      </div>

      <div class="column justify-center items-center">
        <div class="row items-center">
          {{ formatPlace(getPlaceById(order.departurePointId)) }}
          <q-icon name="arrow_right_alt" />
        </div>
        <div class="row items-center">
          <q-icon name="arrow_right_alt" />
          {{ formatPlace(getPlaceById(order.destinationId)) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import OrderStatus from "./OrderStatus.vue";

import {
  timeFormat,
  formatContact,
  formatCustomerMobileFullname,
  formatCustomerMobileSubdivision,
  formatCustomerMobilePhoneNumber,
  formatPlace,
  formatTransportNumber,
} from "src/helpers/formatters";
import AutoNumber from "../base/AutoNumber.vue";
import BaseCard from "src/components/base/Card.vue";
export default {
  name: "OrderListMobile",
  props: ["col", "height"],
  components: {
    AutoNumber,
    OrderStatus,
    BaseCard,
  },
  computed: {
    ...mapState("order", ["orders"]),
    ...mapGetters("contact", ["getContactById"]),
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("transport", ["getTransportById"]),
    ...mapState("current", ["hoveredTransportId"]),
    ...mapState("current", ["currentUser"]),
  },
  watch: {
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
  methods: {
    ...mapMutations("current", ["setOrder"]),
    timeFormat,
    formatContact,
    formatCustomerMobileFullname,
    formatCustomerMobileSubdivision,
    formatCustomerMobilePhoneNumber,
    formatPlace,
    formatTransportNumber,
  },
};
</script>
