<template>
  <MenuItemV2 :col="col" label="Транспорт" v-model="transport">
    <template #main="{ height, onSelected }">
      <TransportList
        :col="col"
        v-if="!$q.screen.xs"
        :height="height"
        @onSelected="onSelected"
        :isLocal="isLocal"
        :transportTypes="_transportTypes"
        :withRecomendations="_withRecomendations"
      />
      <TransportListMobile :col="col" v-else :height="height" />
    </template>
    <template #create="{ height, onDone, selected }">
      <TransportCreation
        :height="height"
        @done="onDone"
        :selected="selected"
        :transportTypes="_transportTypes"
      />
    </template>
    <template #menu="{}">
      <div class="column items-center justify-center q-x-auto">
        <q-checkbox class="col q-my-sm" v-model="_onlyWithDrivers" size="xs">
          <q-tooltip> Только с водителем </q-tooltip>
        </q-checkbox>
        <q-checkbox class="col" v-model="_onlyFree" size="xs">
          <q-tooltip> Только свободные </q-tooltip>
        </q-checkbox>
        <q-checkbox
          class="col"
          v-model="_withRecomendations"
          size="xs"
          v-if="_isMetiz"
        >
          <q-tooltip> Отображать рекомендации </q-tooltip>
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
import { api, getConnection } from "src/boot/axios";
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
    ...mapState("current", [/* "transport",  */ "onlyFree", "onlyWithDrivers"]),
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
    _isMetiz: {
      get() {
        return getConnection() == "mmkmetiz";
      },
    },
  },
  methods: {
    ...mapMutations("current", ["setOnlyFree", "setOnlyWithDrivers"]),
  },
  data() {
    return {
      transport: null,
      _transportTypes: [],
      _withRecomendations: false,
    };
  },
  provide() {
    return {
      isMetiz: this._isMetiz,
    };
  },
  async mounted() {
    const { data } = await api.get("/recommendation/transport-types");
    this._transportTypes = data;
  },
};
</script>

<style></style>
