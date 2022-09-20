<template>
  <div class="row items-center col col-shrink q-pr-md" ref="top">
    <div class="col-1 text-center">Выбрать</div>
    <div class="col">Тип ТС</div>
    <div class="col text-center">Номер ТС</div>
    <div class="col-3 text-center">Водитель</div>
    <div class="col-2 text-center">Место нахождения</div>
    <div class="col-2 text-center">Статус</div>
    <div class="col-1 text-center">В текущем статусе</div>
  </div>
  <q-separator class="q-ma-none" />
  <q-virtual-scroll :items="getByOnlyFreeFilter(onlyFree, freeStatuses.map(s => s.id))" separator v-slot="{ item }"
    :style="`height: ${height}px`" ref="scroll">
    <div :key="item.id">
      <TransportListElement :transport="item" :freeStatuses="freeStatuses" />
    </div>
  </q-virtual-scroll>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import TransportListElement from "./TransportListElement.vue";

export default {
  name: "TransportList",
  components: {
    TransportListElement,
  },
  props: ['col'],
  data() {
    return {
      height: 0,
    }
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
  async mounted() {
    this.height =
      (document.getElementsByClassName("q-page")[0]?.clientHeight / 12 * this.col) - this.$refs.top.clientHeight - 98;
  },
};
</script>

<style>

</style>
