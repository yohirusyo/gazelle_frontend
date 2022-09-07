<template>
  <div class="col column">
    <div class="row justify-between items-center">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="main" label="Заказы" no-caps />
        <q-tab name="create" label="Создание" no-caps />
        <q-tab name="edit" label="Редактирование" no-caps :disable="order == null"/>
      </q-tabs>
    </div>
    <q-separator spaced />
    <q-tab-panels v-model="tab" animated class="col" keep-alive>
      <q-tab-panel name="main" class="col column">
        <OrderList />
      </q-tab-panel>

      <q-tab-panel name="create" class="col column">
        <OrderCreation @done="onDone" />
      </q-tab-panel>

      <q-tab-panel name="edit" class="col column">
        <OrderEdit @done="onDone" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import OrderList from "./OrderList.vue";
import OrderCreation from "./OrderCreation.vue";
import OrderEdit from "./OrderEdit.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "Order",
  components: {
    OrderList,
    OrderCreation,
    OrderEdit,
  },
  data() {
    return {
      tab: "main",
    };
  },
  computed: {
    ...mapState("current", ["order"]),
  },
  methods: {
    ...mapActions("customer", ["requestCustomers"]),
    ...mapActions("contact", ["requestContacts"]),
    async onDone() {
      this.tab = "main";
      await this.resuestContactsAndCustomers();
    },
    async resuestContactsAndCustomers() {
      await this.requestContacts();
      await this.requestCustomers();
    },
  },
  async mounted() {
    await this.resuestContactsAndCustomers();
  },
  watch: {
    order(newOrder) {
      if (!!newOrder) {
        this.tab = "edit";
      }
    },
  },
};
</script>

<style></style>
