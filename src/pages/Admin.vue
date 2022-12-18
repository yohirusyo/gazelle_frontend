<template>
  <q-page class="row items-stretch">
    <div class="col column">
      <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <Customer :col="6" />
        </BaseCard>
      </div>
      <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <Place :col="6" />
        </BaseCard>
      </div>
    </div>
  </q-page>
</template>

<script>
import BaseCard from "src/components/base/Card.vue";
import Order from "src/components/order/OrderComponent.vue";
import Customer from "src/components/customer/CustomerComponent.vue";
import Driver from "src/components/driver/DriverComponent.vue";
import Place from "src/components/place/PlaceComponent.vue";
import YaMap from "src/components/map/YaMap.vue";
import { mapActions } from "vuex";
import { Loading } from "quasar";
export default {
  name: "PageAdmin",
  components: {
    BaseCard,
    Order,
    Customer,
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
