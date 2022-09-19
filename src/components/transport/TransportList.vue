<template>
  <div class="row items-center col col-shrink">
    <div class="col-1 text-center">Выбрать</div>
    <div class="col">Тип ТС</div>
    <div class="col">Номер ТС</div>
    <div class="col-3">Водитель</div>
    <div class="col-2">Место нахождения</div>
    <div class="col-2 text-center">Статус</div>
    <div class="col-1 text-center">В текущем статусе</div>
  </div>
  <q-separator  class="q-ma-none" />
  <q-scroll-area class="col">
    <TransportListElement
      v-for="transport in getByOnlyFreeFilter(onlyFree, freeStatuses.map(s => s.id))"
      :key="transport.id"
      :transport="transport"
      :freeStatuses="freeStatuses"
    />
  </q-scroll-area>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import TransportListElement from "./TransportListElement.vue";

export default {
  name: "TransportList",
  components: {
    TransportListElement,
  },
  computed: {
    ...mapState("current", ["onlyFree"]),
    ...mapState("status", ["statuses"]),
    ...mapGetters("transport", ["getByOnlyFreeFilter"]),
    freeStatuses: {
      get() {
        return this.statuses.filter((s) => s.isBusy == false);
      },
    },
  },
  methods: {
    ...mapActions("transport", ["requestTransports"]),
  },
  async mounted() {
    await this.requestTransports();
  },
};
</script>

<style></style>
