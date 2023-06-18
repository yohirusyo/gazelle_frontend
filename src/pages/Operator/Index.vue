<template>
  <q-page class="row bg-white">
    <div
      class="col"
      :class="{ 'q-pa-md': !$q.screen.xs }"
      style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <Order />
    </div>
    <div class="col column" v-if="!$q.screen.xs">
      <div class="col row" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)">
        <div class="col q-pa-md">
          <Transport :col="6" :isLocal="false" />
        </div>
      </div>
      <div class="q-pa-md col" v-if="shortConnectionName() != 'ММК-МЕТИЗ'">
        <Transport :col="6" :isLocal="true" />
      </div>
    </div>
  </q-page>
</template>

<script>
import Order from "src/components/order/Component.vue";
import Transport from "src/components/transport/TransportComponent.vue";
import { shortConnectionName } from "src/helpers/formatters.js";
export default {
  components: { Order, Transport },
  methods: {
    shortConnectionName,
  },
};
</script>
