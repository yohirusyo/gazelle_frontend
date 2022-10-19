<template>
  <q-page class="row items-stretch" v-if="!$q.screen.xs">
    Пока не готово (
  </q-page>
  <q-page class="column q-pa-xs" v-else>
    <BaseCard class="col bg-white column">
      <Transport :col="12" />
    </BaseCard>
  </q-page>
</template>

<script>
import BaseCard from "src/components/base/Card.vue";
import Order from "src/components/order/OrderComponent.vue";
import Transport from "src/components/transport/TransportComponent.vue";
import Driver from "src/components/driver/DriverComponent.vue";
import Place from "src/components/place/PlaceComponent.vue";
import YaMap from "src/components/map/YaMap.vue";

export default {
  name: "TransportPage",
  components: {
    BaseCard,
    Order,
    Transport,
    Driver,
    Place,
    YaMap,
  },
};
</script>

<style lang="scss" scoped></style>
