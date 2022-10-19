<template>
  <MenuItem :col="col" label="Заказы" v-model="order">
    <template #main="{ height }">
      <OrderList :col="col" v-if="!$q.screen.xs" :height="height" />
      <OrderListMobile :col="col" v-else :height="height" />
    </template>
    <template #create="{ height, onDone }">
      <OrderCreation @done="onDone" :height="height" />
    </template>
  </MenuItem>
</template>

<script>
import OrderList from "./OrderList.vue";
import OrderListMobile from "./OrderListMobile.vue";
import OrderCreation from "./OrderCreation.vue";
import { mapState } from "vuex";
import MenuItem from "src/components/base/MenuItem.vue";
export default {
  name: "Order",
  components: {
    OrderList,
    OrderCreation,
    OrderListMobile,
    MenuItem,
  },
  props: ["col"],
  computed: {
    ...mapState("current", ["order"]),
  },
};
</script>

<style></style>
