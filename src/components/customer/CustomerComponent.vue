<template>
  <div class="col column">
    <div class="row justify-between items-center">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="main" label="Ответственные" no-caps />
        <q-tab name="create" label="Создание" no-caps />
        <q-tab name="edit" label="Редактирование" :disable="customer == null" no-caps />
      </q-tabs>
    </div>
    <q-separator spaced />
    <q-tab-panels v-model="tab" animated class="col" keep-alive>
      <q-tab-panel name="main" class="col column">
        <CustomerList :col="col"/>
      </q-tab-panel>

      <q-tab-panel name="create" class="col column">
        <CustomerCreation @done="onDone" />
      </q-tab-panel>

      <q-tab-panel name="edit" class="col column">
        <CustomerEdit @done="onDone" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import CustomerList from "./CustomerList.vue";
import CustomerCreation from "./CustomerCreation.vue";
import CustomerEdit from "./CustomerEdit.vue";
import { mapState } from "vuex";
export default {
  name: "Customer",
  components: {
    CustomerList,
    CustomerCreation,
    CustomerEdit,
  },
  props: ['col'],
  computed: {
    ...mapState("current", ["customer"]),
  },
  methods: {
    onDone() {
      this.tab = "main";
    },
  },
  data() {
    return {
      tab: "main",
    };
  },
  watch: {
    customer(newCustomer) {
      if (!!newCustomer) {
        this.tab = "edit";
      }
    },
  },
};
</script>

<style>

</style>
