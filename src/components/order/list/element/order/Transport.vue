<template>
  <div class="fit column justify-center" v-if="transportId" :class="_withoutDriver ? 'bg-red' : ''">
    <div
      class="row justify-center"
      
      
    >
      <AutoNumber :number="formatTransportNumber(_transport)" />
    </div>
  </div>

  <div v-else>Транспорт не выбран!</div>
</template>

<script>
import AutoNumber from "src/components/base/AutoNumber.vue";
import { mapGetters } from "vuex";
import { formatTransportNumber } from "src/helpers/formatters";
export default {
  props: ["transportId"],
  components: {
    AutoNumber,
  },
  computed: {
    ...mapGetters("transport", ["getTransportById"]),
    _transport: {
      get() {
        return this.getTransportById(this.transportId);
      },
    },
    _withoutDriver: {
      get() {
        return !this._transport.driver;
      },
    },
  },
  methods: { formatTransportNumber },
};
</script>
