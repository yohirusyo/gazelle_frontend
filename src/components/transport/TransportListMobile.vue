<template>
  <div :style="`height: ${height}px`" style="background: transparent">
    <TransportListElementMobile
      v-for="transport of getByOnlyFreeFilter(
        onlyFree,
        onlyWithDrivers,
        freeStatuses.map((s) => s.id)
      )"
      :key="transport.id"
      :transport="transport"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import TransportListElementMobile from "./TransportListElementMobile.vue";
export default {
  name: "TransportListMobile",
  components: {
    TransportListElementMobile,
  },
  props: ["col", "height"],
  computed: {
    ...mapState("current", ["onlyFree", "onlyWithDrivers"]),
    ...mapState("status", ["statuses"]),
    ...mapGetters("transport", ["getByOnlyFreeFilter"]),

    freeStatuses: {
      get() {
        return this.statuses.filter((s) => s.isBusy == false);
      },
    },
  },
};
</script>

<style></style>
