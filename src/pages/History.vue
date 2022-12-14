<template>
  <q-page class="row items-stretch" v-if="!$q.screen.xs">
    Пока не готово (
  </q-page>
  <q-page class="column" v-else>
    <OrderHistory :col="12" />
  </q-page>
</template>

<script>
import BaseCard from "src/components/base/Card.vue";
import OrderHistory from "src/components/customer/history/OrderHistory.vue";
export default {
  name: "History",
  components: {
    BaseCard,
    OrderHistory,
  },
};
</script>

<style lang="scss" scoped></style>
