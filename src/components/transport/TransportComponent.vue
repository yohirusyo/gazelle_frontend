<template>
  <MenuItemV2
    :col="col"
    label="Транспорт"
    v-model="transport"
  >
    <template #main="{ height, onSelected }">
      <TransportList
        :col="col"
        v-if="!$q.screen.xs"
        :height="height"
        @onSelected="onSelected"
        :isLocal="isLocal"
      />
      <TransportListMobile
        :col="col"
        v-else
        :height="height"
      />
    </template>
    <template #create="{ height, onDone, selected }">
      <TransportCreation
        :height="height"
        @done="onDone"
        :selected="selected"
      />
    </template>
    <template #menu="{}">
      <div class="column items-center justify-center q-x-auto">
        <q-checkbox
          class="col q-my-sm"
          v-model="_onlyWithDrivers"
          size="xs"
        >
          <q-tooltip> Только с водителем </q-tooltip>
        </q-checkbox>
        <q-checkbox
          class="col"
          v-model="_onlyFree"
          size="xs"
        >
          <q-tooltip> Только свободные </q-tooltip>
        </q-checkbox>
      </div>
    </template>
  </MenuItemV2>
</template>

<script>
import TransportList from "./list/List.vue";
import TransportListMobile from "./list/mobile/List.vue";
import TransportCreation from "./TransportCreation.vue";
import MenuItemV2 from "src/components/base/MenuItemV2.vue";
import { mapMutations, mapState } from "vuex";
export default {
  name: "Transport",
  components: {
    TransportList,
    TransportCreation,
    MenuItemV2,
    TransportListMobile,
  },
  props: ["col", "isLocal"],
  computed: {
    ...mapState("current", [/* "transport",  */"onlyFree", "onlyWithDrivers"]),
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
  data() {
    return {
      transport: null
    }
  },
};
</script>

<style></style>
