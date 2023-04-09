<template>
  <OperatorIndex v-if="currentUser?.role != 'CUSTOMER'" />
  <CustomerIndex v-else />
</template>

<script>

import CustomerIndex from "./Customer/Index.vue";
import OperatorIndex from "./Operator/Index.vue";
import { mapState } from "vuex";
export default {
  name: "PageIndex",
  components: {
    CustomerIndex,
    OperatorIndex
  },
  computed: {
    ...mapState("current", ["currentUser"]),
  },

};
</script>

<style lang="scss" scoped></style>
