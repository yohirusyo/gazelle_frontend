<template>
  <div class="col column">
    <div class="row justify-between items-center">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="transparent"
        align="justify"
        narrow-indicator
      >
        <q-tab name="main" label="Заказы" no-caps :ripple="false" />
        <q-tab
          name="create"
          :label="!order ? 'Создание' : 'Редактирование'"
          no-caps
          :ripple="false"
        />
      </q-tabs>
    </div>
    <q-tab-panels v-model="tab" animated class="col" keep-alive>
      <q-tab-panel name="main" class="col column">
        <OrderList :col="col" />
      </q-tab-panel>

      <q-tab-panel name="create" class="col column">
        <OrderCreation @done="onDone" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import OrderList from "./OrderList.vue";
import OrderCreation from "./OrderCreation.vue";
import { mapState } from "vuex";

export default {
  name: "Order",
  components: {
    OrderList,
    OrderCreation,
  },
  props: ["col"],
  data() {
    return {
      tab: "main",
    };
  },
  computed: {
    ...mapState("current", ["order"]),
  },
  methods: {
    async onDone() {
      this.tab = "main";
    },
  },
  async mounted() {},
  watch: {
    order(newOrder) {
      if (!!newOrder) {
        this.tab = "create";
      }
    },
  },
};
</script>

<style></style>
