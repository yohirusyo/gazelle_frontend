<template>
  <OperatorIndex />
  <!-- <q-page
    class="row items-stretch justify-center"
    v-if="!$q.screen.xs"
  >
    <div class="col-6 column">
      <div
        class="col bg-white q-pa-md column"
        style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
      >
        <Order
          :col="12"
          v-if="currentUser?.role != 'CUSTOMER'"
        />
        <OrderRequestCreation v-else />
      </div>
    </div>
    <div
      class="col-6 column"
      v-if="currentUser?.role != 'CUSTOMER'"
    >

      <div class="col bg-white  column">
        <div
          class="col row"
          style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)"
        >
          <div class="col q-pa-md">
            <Transport :col="6" :isLocal="false" />

          </div>
        </div>
        <div class="q-pa-md col">

          <Transport :col="6" :isLocal="true" />
        </div>
      </div>
    </div>

    <div
      class="col-6 column"
      v-else
    >
      <div class="col bg-white column">
        <OrderHistory :col="12" />
      </div>
    </div>
  </q-page>

  <q-page
    class="column"
    v-else
  >
    <div class="col bg-white column">
      <Order
        :col="12"
        v-if="currentUser?.role != 'CUSTOMER'"
      />
      <OrderRequestCreation v-else />
    </div>
  </q-page> -->
</template>

<script>

import CustomerIndex from "./Customer/Index.vue";
import OperatorIndex from "./Operator/Index.vue";
import Order from "src/components/order/OrderComponent.vue";
import Transport from "src/components/transport/TransportComponent.vue";
import OrderRequestCreation from "src/components/customer/form/OrderRequestCreation.vue";
import OrderHistory from "src/components/customer/history/OrderHistory.vue";
import { mapState } from "vuex";
export default {
  name: "PageIndex",
  components: {
    Order,
    Transport,
    OrderRequestCreation,
    OrderHistory,
    CustomerIndex,
    OperatorIndex
  },
  computed: {
    ...mapState("current", ["currentUser"]),
  },

};
</script>

<style lang="scss" scoped></style>
