<template>
  <div class="col column">
    <div class="row justify-between items-center">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="main" label="Водители" no-caps />
        <q-tab name="create" label="Создание" no-caps />
        <q-tab name="edit" label="Редактирование" :disable="driver == null" no-caps />
      </q-tabs>
    </div>
    <q-separator spaced />
    <q-tab-panels v-model="tab" animated class="col" keep-alive>
      <q-tab-panel name="main" class="col column">
        <DriverList :col="col"/>
      </q-tab-panel>

      <q-tab-panel name="create" class="col column">
        <DriverCreation @done="onDone" />
      </q-tab-panel>

      <q-tab-panel name="edit" class="col column">
        <DriverEdit @done="onDone" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import DriverList from "./DriverList.vue";
import DriverCreation from "./DriverCreation.vue";
import DriverEdit from "./DriverEdit.vue";
import { mapState } from "vuex";
export default {
  name: "Driver",
  components: {
    DriverList,
    DriverCreation,
    DriverEdit,
  },
  props: ['col'],
  computed: {
    ...mapState("current", ["driver"]),
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
    driver(newDriver) {
      if (!!newDriver) {
        this.tab = "edit";
      }
    },
  },
};
</script>

<style>

</style>
