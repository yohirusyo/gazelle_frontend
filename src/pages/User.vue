<template>
  <q-page class="row items-stretch" v-if="!$q.screen.xs">
    <div class="col-12 row justify-center">
      <div class="col col-8 bg-white q-pa-md column">
        <User :col="12" />
      </div>
    </div>
  </q-page>
  <q-page class="column" v-else>
    <div class="col bg-white column">
      <User :col="12" />
    </div>
  </q-page>
</template>

<script>
import BaseCard from "src/components/base/Card.vue";
import Order from "src/components/order/OrderComponent.vue";
import Transport from "src/components/transport/TransportComponent.vue";
import Driver from "src/components/driver/DriverComponent.vue";
import Place from "src/components/place/PlaceComponent.vue";
import User from "src/components/user/UserComponent.vue";
import YaMap from "src/components/map/YaMap.vue";

export default {
  name: "UserPage",
  components: {
    BaseCard,
    Order,
    Transport,
    Driver,
    Place,
    YaMap,
    User,
  },
};
</script>

<style lang="scss" scoped></style>
