<template>
  <q-page class="row items-stretch justify-center" v-if="!$q.screen.xs">
    <div class="col-6 column">
      <div class="col-12 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <Order :col="12" v-if="currentUser?.role != 'CUSTOMER'" />
          <OrderRequestCreation v-else />
        </BaseCard>
      </div>
    </div>
    <div class="col-6 column" v-if="currentUser?.role != 'CUSTOMER'">
      <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <Transport :col="6" />
        </BaseCard>
      </div>
      <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <YaMap :col="6" />
        </BaseCard>
      </div>
    </div>
    <div class="col-6 column" v-else>
      <div class="col-12 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <OrderHistory :col="12" />
        </BaseCard>
      </div>
    </div>
    
  </q-page>
  
  <q-page class="column q-pa-xs" v-else>
    <BaseCard class="col bg-white column">
      <Order :col="12" v-if="currentUser?.role != 'CUSTOMER'" />
      <OrderRequestCreation v-else />
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
import OrderRequestCreation from "src/components/customer/form/OrderRequestCreation.vue";
import OrderHistory from "src/components/customer/history/OrderHistory.vue";
import { mapState } from "vuex";
export default {
  name: "PageIndex",
  components: {
    BaseCard,
    Order,
    Transport,
    Driver,
    Place,
    YaMap,
    OrderRequestCreation,
    OrderHistory,
  },
  computed: {
    ...mapState("current", ["currentUser"]),
  },
};
</script>

<style lang="scss" scoped></style>
