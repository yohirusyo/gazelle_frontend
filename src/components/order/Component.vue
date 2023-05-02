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
    <template #create="{ onDone, selected }">
      <OrderForm
        @done="onDone"
        :selected="selected"
      />
    </template>
  </MenuItemV2>
</template>

<script>
import OrderList from "./list/List.vue";
import OrderListMobile from "./list/mobile/List.vue";
import OrderForm from "src/components/order/form/Form.vue";
import { mapState } from "vuex";
import MenuItemV2 from "src/components/base/MenuItemV2.vue";
export default {
  name: "Order",
  components: {
    OrderList,
    OrderForm,
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
