<template>
  <div class="row col" v-if="!$q.screen.xs">
    <div
      class="col q-pa-md column"
      style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <div class="col column">
        <Owner />
        <Percentage />
      </div>
      <LimitRequests />
    </div>
    <div
      class="col q-pa-md column"
      style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <div class="col-6" ref="tbl">
        <OrderHistory :style="`height: ${height}px`" />
      </div>
      <Hierarchy class="col-6" />
    </div>
  </div>
  <div v-else>
    <div class="q-pa-md" style="height: 100vh">
      <div class="col">
        <Owner />
        <Percentage />
      </div>
      <LimitRequests />
    </div>
    <div class="col column" style="height: 100vh; font-size: 0.7rem">
      <div class="col-6" ref="tbl">
        <OrderHistory :style="`height: ${height}px`" />
      </div>
    </div>
    <div class="col q-pa-md column" style="height: 100vh">
      <Hierarchy />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Owner from "./Owner.vue";
import Percentage from "./Percentage.vue";
import Hierarchy from "./hierarchy/Hierarchy.vue";
import LimitRequests from "./LimitRequests.vue";
import History from "./History/History.vue";
import OrderHistory from "./History/OrderHistory.vue";
export default {
  components: {
    Owner,
    Percentage,
    Hierarchy,
    LimitRequests,
    History,
    OrderHistory,
  },
  methods: {
    ...mapActions("management", ["requestMyManagement"]),
  },
  data() {
    return {
      height: 0,
    };
  },
  async mounted() {
    await this.requestMyManagement();
    this.height = this.$refs.tbl.clientHeight - 2;
  },
};
</script>
