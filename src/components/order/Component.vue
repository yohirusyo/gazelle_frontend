<template>
  <MenuItemV2 :col="col" label="Заказы" v-model="order">
    <template #main="{ height, onSelected }">
      <OrderList
        :col="col"
        v-if="!$q.screen.xs"
        :height="height"
        @onSelected="
          (route) => {
            onSelected(route);
            onSelectedRoute(route);
          }
        "
        :twoHoursToStart="twoHoursToStart"
        :cargoTypes="cargoTypes"
        :prioritySort="prioritySort"
      />
      <OrderListMobile :col="col" v-else :height="height" />
    </template>
    <template #create="{ onDone, selected }">
      <OrderForm
        @done="
          () => {
            onDone();
            setTransportRecommendationList([]);
          }
        "
        :selected="selected"
        :cargoTypes="cargoTypes"
      />
    </template>
    <template #menu="{}">
      <div class="column items-center justify-center q-x-auto">
        <q-checkbox class="col" v-model="twoHoursToStart" size="xs">
          <q-tooltip> 2 часа до начала </q-tooltip>
        </q-checkbox>
        <q-checkbox class="col" v-model="prioritySort" size="xs">
          <q-tooltip> Сортировка по приоритетам </q-tooltip>
        </q-checkbox>
        <AutoWrapper />
      </div>
    </template>
  </MenuItemV2>
</template>

<script>
import OrderList from "./list/List.vue";
import OrderListMobile from "./list/mobile/List.vue";
import OrderForm from "src/components/order/form/Form.vue";
import { mapState, mapMutations } from "vuex";
import MenuItemV2 from "src/components/base/MenuItemV2.vue";
import { api } from "src/boot/axios";
import AutoWrapper from "src/components/recommendation/auto-dialog/Wrapper.vue";

export default {
  name: "Order",
  components: {
    OrderList,
    OrderForm,
    OrderListMobile,
    MenuItemV2,
    AutoWrapper,
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
  methods: {
    ...mapMutations("transport", ["setTransportRecommendationList"]),
    async onSelectedRoute(route) {
      const orderWithCT = route.orders.find((order) => {
        const ct = this.cargoTypes.find((ct) => ct.id === order.cargoTypeId);
        if (!ct || ct.ignoreInRecommendation) return false;
        return true;
      });
      if (!orderWithCT) {
        this.setTransportRecommendationList([]);
        return;
      }
      const { data } = await api.get(
        `/recommendation/related-transport-types/${orderWithCT.cargoTypeId}`
      );
      if (!data?.transportTypes) {
        this.setTransportRecommendationList([]);
        return;
      }
      this.setTransportRecommendationList(
        data.transportTypes.map((tt) => tt.id)
      );
    },
  },
};
</script>

<style></style>
