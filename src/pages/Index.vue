<template>
  <q-page class="row items-stretch">
    <div class="col column">
      <div class="col-12 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <Order :col="12" />
        </BaseCard>
      </div>
      <!-- <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <YaMap />
        </BaseCard>
      </div> -->
    </div>
    <div class="col column">
      <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <Transport :col="6" />
        </BaseCard>
      </div>
      <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <Driver :col="6" />
        </BaseCard>
      </div>
    </div>
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
  name: "PageIndex",
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

<style lang="scss" scoped>

</style>
