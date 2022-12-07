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
      <div class="column items-center justify-center q-x-auto">
        <q-checkbox class="col q-my-sm" v-model="_onlyWithDrivers">
          <q-tooltip> Только с водителем </q-tooltip>
        </q-checkbox>
        <q-checkbox class="col" v-model="_onlyFree">
          <q-tooltip> Только свободные </q-tooltip>
        </q-checkbox>
      </div>
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
