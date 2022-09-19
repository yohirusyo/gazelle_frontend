<template>
  <q-page class="row items-stretch">
    <div class="col column">
      <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <Order />
        </BaseCard>
      </div>
      <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <YaMap />
        </BaseCard>
      </div>
    </div>
    <div class="col column">
      <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <Transport />
        </BaseCard>
      </div>
      <div class="col-6 row">
        <div class="col-7 row q-pa-xs">
          <BaseCard class="col bg-white q-pa-md column">
            <Driver />
          </BaseCard>
        </div>
        <div class="col-5 row q-pa-xs">
          <BaseCard class="col bg-white q-pa-md column">
            <Place />
          </BaseCard>
        </div>
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
import { mapActions } from "vuex";
import {
    Loading,
} from 'quasar'
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
  methods: {
    ...mapActions("status", ["requestStatuses"]),
  },
  async mounted() {
    Loading.show();
    await this.requestStatuses();
    Loading.hide();
  },
};
</script>

<style lang="scss" scoped></style>
