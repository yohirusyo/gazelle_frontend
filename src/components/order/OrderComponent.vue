<template>
  <MenuItemV2
    :col="col"
    label="Заказы"
    v-model="order"
  >
    <template #main="{ height, onSelected }">
      <OrderList
        :col="col"
        v-if="!$q.screen.xs"
        :height="height"
        @onSelected="onSelected"
      />
      <OrderListMobile
        :col="col"
        v-else
        :height="height"
      />
    </template>
    <template #create="{ height, onDone, selected }">
      <OrderCreation
        @done="onDone"
        :height="height"
        :selected="selected"
      />
    </template>
  </MenuItemV2>
</template>

<script>
import OrderList from "./OrderList.vue";
import OrderListMobile from "./OrderListMobile.vue";
import OrderCreation from "./OrderCreation.vue";
import { mapState } from "vuex";
import MenuItemV2 from "src/components/base/MenuItemV2.vue";
export default {
  name: "Order",
  components: {
    OrderList,
    OrderCreation,
    OrderListMobile,
    MenuItemV2,
  },
  props: ["col"],
  computed: {
    ...mapState("current", ["order"]),
  },
};
</script>

<style></style>
