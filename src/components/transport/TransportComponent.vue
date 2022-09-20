<template>
  <div class="col column">
    <div class="row justify-between items-center">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey row justify-between fit"
        active-color="primary"
        indicator-color="primary"
        narrow-indicator
      >
        <div class="row col justify-start">
          <q-tab name="main" label="Транспорт" no-caps />
          <q-tab name="create" label="Создание" no-caps />
          <q-tab
            name="edit"
            label="Редактирование"
            :disable="transport == null"
            no-caps
          />
        </div>

        <q-checkbox left-label v-model="_onlyFree" label="Только свободные" />
      </q-tabs>
    </div>
    <q-separator spaced />
    <q-tab-panels v-model="tab" animated class="col" keep-alive>
      <q-tab-panel name="main" class="col column">
        <TransportList :col="col"/>
      </q-tab-panel>

      <q-tab-panel name="create" class="col column">
        <TransportCreation @done="onDone" />
      </q-tab-panel>

      <q-tab-panel name="edit" class="col column">
        <TransportEdit @done="onDone" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import TransportList from "./TransportList.vue";
import TransportCreation from "./TransportCreation.vue";
import TransportEdit from "./TransportEdit.vue";
import { mapMutations, mapState } from "vuex";
export default {
  name: "Transport",
  components: {
    TransportList,
    TransportCreation,
    TransportEdit,
  },
  props: ['col'],
  computed: {
    ...mapState("current", ["transport", "onlyFree"]),
    _onlyFree: {
      get() {
        return this.onlyFree;
      },
      set(newVal) {
        this.setOnlyFree(newVal);
      },
    },
  },
  methods: {
    ...mapMutations("current", ["setOnlyFree"]),
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
        this.tab = "edit";
      }
    },
  },
};
</script>

<style></style>
