<template>
  <div :style="`height: ${height}px`" style="background: transparent">
    <BaseCard
      class="bg-white q-pa-sm column q-my-sm q-mx-sm"
      v-for="order of orders"
      :key="order.id"
      radius="md"
      @click="setOrder(order)"
    >
      <div class="row col-shrink items-center justify-start">
        <span class="col col-shrink q-mx-sm">
          {{ "№ " + order.id }}
        </span>
        <q-chip
          class="q-ma-none col col-shrink"
          :class="order.isEmergency ? 'bg-red text-white' : ''"
        >
          {{ timeFormat(order?.orderTime) }}
        </q-chip>
        <div>
          <OrderStatus :orderId="order.id" />
        </div>
      </div>
      <div class="q-ma-sm">
        <div class="row" v-if="order.transportId">
          <AutoNumber
            :number="formatTransportNumber(getTransportById(order.transportId))"
          />
        </div>
        <div v-else>Транспорт не выбран!</div>
      </div>
      <div class="row q-mx-sm">
        <div class="q-mr-sm">
          {{ order.name }}
        </div>
        <div v-if="order.description" class="text-grey">
          {{ order.description }}
        </div>
      </div>
      <div class="row q-mx-sm">
        <div class="q-mr-sm">
          {{ formatCustomerMobileFullname(getCustomerById(order.customerId)) }}
        </div>
        <div class="q-mr-sm">
          {{
            formatCustomerMobileSubdivision(getCustomerById(order.customerId))
          }}
        </div>
        <div>
          {{
            formatCustomerMobilePhoneNumber(getCustomerById(order.customerId))
          }}
        </div>
      </div>
      <div class="row q-mx-sm q-pb-sm items-center">
        <div class="q-mr-sm">
          {{ formatPlace(getPlaceById(order.departurePointId)) }}
        </div>
        <q-icon name="las la-long-arrow-alt-right" class="q-mr-sm"></q-icon>
        <div>
          {{ formatPlace(getPlaceById(order.destinationId)) }}
        </div>
      </div>
    </BaseCard>
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
