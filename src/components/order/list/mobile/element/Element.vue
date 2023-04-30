<template>
  <div
    class="column"
    v-for="route of orders"
    :key="route.id"
    @click="setOrder(route)"
    :class="
      route.isRequest && !route.isApproved
        ? 'bg-blue-2 '
        : route.isRequest && route.isApproved
        ? 'bg-blue-1 '
        : 'bg-white '
    "
    style="border: 1px solid rgba(0, 0, 0, 0.12)"
  >
    <Header :routeId="route.id" />

    <Customer :customerId="firstOrder?.customerId" />

    <div class="q-pa-xs">
      <Order v-for="order of route.orders" :key="order.id" :order="order" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import Header from "./Header.vue";
import Customer from "./Customer.vue";
import Order from "./Order.vue";

export default {
  props: ["route"],
  components: {
    Header,
    Customer,
    Order,
  },
  computed: {
    ...mapState("order", ["orders"]),

    firstOrder: {
      get() {
        return this.route.orders[0];
      },
    },
  },
  methods: {
    ...mapMutations("current", ["setOrder"]),
  },
};
</script>
