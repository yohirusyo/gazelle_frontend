<template>
  <div class="column" style="border: 1px solid rgba(0, 0, 0, 0.12)">
    <div class="row justify-center">
      <q-chip :class="order.isEmergency ? 'bg-red text-white' : ''">
        Заявка № {{ order.id }} /
        {{ order?.orderTime ? timeFormat(order?.orderTime) : "Маршрут" }}
      </q-chip>
    </div>

    <div class="row justify-center">
      <AutoNumber
        v-if="order.transportId"
        :number="formatTransportNumber(getTransportById(order.transportId))"
      />
      <div class="q-pa-xs" v-else>Транспорт не выбран!</div>
    </div>

    <div class="row justify-center">
      <Status
        :statusId="order.statusId"
        :statusChangedAt="order.statusChangedAt"
      />
    </div>

    <div class="column justify-center items-center">
      <div class="row">
        {{ order.name }}
      </div>
      <div class="row text-grey">
        {{ order.description ? order.description : "" }}
      </div>
    </div>

    <div class="column justify-center items-center">
      <div class="row items-center">
        {{ formatPlace(getPlaceById(order.departurePointId)) }}
        <q-icon name="arrow_right_alt" />
      </div>
      <div class="row items-center">
        <q-icon name="arrow_right_alt" />
        {{ formatPlace(getPlaceById(order.destinationId)) }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  formatPlace,
  formatTransportNumber,
  timeFormat,
} from "src/helpers/formatters";
import AutoNumber from "src/components/base/AutoNumber.vue";
import Status from "src/components/order/list/element/order/Status.vue";
import { mapGetters } from "vuex";
export default {
  props: ["order"],
  components: {
    AutoNumber,
    Status,
  },
  computed: {
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("transport", ["getTransportById"]),
  },
  methods: {
    formatPlace,
    formatTransportNumber,
    timeFormat,
  },
};
</script>
