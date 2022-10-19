<template>
  <MenuItem :col="col" label="Транспорт" v-model="transport">
    <template #main="{ height }">
      <TransportList :col="col" v-if="!$q.screen.xs" :height="height" />
      <TransportListMobile :col="col" v-else :height="height" />
    </template>
    <template #create="{ height, onDone }">
      <TransportCreation :height="height" @done="onDone" />
    </template>
    <template #menu="{}">
      <q-checkbox v-model="_onlyWithDrivers" label="Только с водителем" dense />
      <q-checkbox v-model="_onlyFree" label="Только свободные" dense />
    </template>
  </MenuItem>
</template>

<script>
import TransportList from "./TransportList.vue";
import TransportListMobile from "./TransportListMobile.vue";
import TransportCreation from "./TransportCreation.vue";
import MenuItem from "src/components/base/MenuItem.vue";
import { mapMutations, mapState } from "vuex";
export default {
  name: "Transport",
  components: {
    TransportList,
    TransportCreation,
    MenuItem,
    TransportListMobile,
  },
  props: ["col"],
  computed: {
    ...mapState("current", ["transport", "onlyFree", "onlyWithDrivers"]),
    _onlyFree: {
      get() {
        return this.onlyFree;
      },
      set(newVal) {
        this.setOnlyFree(newVal);
      },
    },
    _onlyWithDrivers: {
      get() {
        return this.onlyWithDrivers;
      },
      set(newVal) {
        this.setOnlyWithDrivers(newVal);
      },
    },
  },
  methods: {
    ...mapMutations("current", ["setOnlyFree", "setOnlyWithDrivers"]),
  },
};
</script>

<style></style>
