<template>
  <div class="col column">
    <div class="row justify-between items-center">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey row justify-between fit"
        active-color="primary"
        indicator-color="transparent"
        narrow-indicator
      >
        <div class="row col justify-start">
          <q-tab name="main" label="Транспорт" no-caps :ripple="false" />
          <q-tab
            name="create"
            :label="!transport ? 'Создание' : 'Редактирование'"
            no-caps
            :ripple="false"
          />
        </div>
        <div class="row q-gutter-x-md">
          <q-checkbox
            v-model="_onlyWithDrivers"
            label="Только с водителем"
            dense
          />
          <q-checkbox v-model="_onlyFree" label="Только свободные" dense />
        </div>
      </q-tabs>
    </div>
    <q-tab-panels v-model="tab" animated class="col" keep-alive>
      <q-tab-panel name="main" class="col column">
        <TransportList :col="col" />
      </q-tab-panel>

      <q-tab-panel name="create" class="col column">
        <TransportCreation @done="onDone" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import TransportList from "./TransportList.vue";
import TransportCreation from "./TransportCreation.vue";
import { mapMutations, mapState } from "vuex";
export default {
  name: "Transport",
  components: {
    TransportList,
    TransportCreation,
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
    transport(newTransport) {
      if (!!newTransport) {
        this.tab = "create";
      }
    },
  },
};
</script>

<style></style>
