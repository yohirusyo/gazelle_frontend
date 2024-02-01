<template>
  <MenuItemV2 :col="col" label="Заказы" v-model="order">
    <template #main="{ height, onSelected }">
      <OrderList :col="col" v-if="!$q.screen.xs" :height="height" @onSelected="onSelected"
        :twoHoursToStart="twoHoursToStart" :cargoTypes="cargoTypes" :prioritySort="prioritySort" />
      <OrderListMobile :col="col" v-else :height="height" />
    </template>
    <template #create="{ onDone, selected }">
      <OrderForm @done="onDone" :selected="selected" :cargoTypes="cargoTypes" />
    </template>
    <template #menu="{ }">
      <div class="column items-center justify-center q-x-auto">
        <q-checkbox class="col" v-model="twoHoursToStart" size="xs">
          <q-tooltip> 2 часа до начала </q-tooltip>
        </q-checkbox>
        <q-checkbox class="col" v-model="prioritySort" size="xs">
          <q-tooltip> Сортировка по приоритетам </q-tooltip>
        </q-checkbox>
      </div>
    </template>
  </MenuItemV2>
</template>

<script>
import OrderList from "./list/List.vue";
import OrderListMobile from "./list/mobile/List.vue";
import OrderForm from "src/components/order/form/Form.vue";
import { mapState } from "vuex";
import MenuItemV2 from "src/components/base/MenuItemV2.vue";
import { api } from 'src/boot/axios'
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
  async mounted() {
    try {
      const { data } = await api.get("/recommendation/cargo-types");
      this.cargoTypes = data;
    } catch (error) {
      console.error("Ошибка получения типов ТС");
    }
  },
  data() {
    return {
      twoHoursToStart: true,
      prioritySort: false,
      cargoTypes: [],
    };
  },
};
</script>

<style></style>
