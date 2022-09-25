<template>
  <q-chip
    class="text-wrap "
    :class="_isFreeMoreThan15Minutes ? 'bg-green text-white' : ''"
  >
    {{ getStatusById(order?.statusId)?.description }}
  </q-chip>
</template>

<script>
import { mapGetters } from "vuex";
import {
  timeFormat,
  formatDriver,
  formatPlace,
} from "src/helpers/formatters";
import * as moment from "moment";
export default {
  name: "OrderStatus",
  props: ["orderId"],
  computed: {
    ...mapGetters("status", ["getStatusById"]),
    ...mapGetters('order', ['getOrderById']),
    order: {
      get() {
        return this.getOrderById(this.orderId);
      }
    },
  },
  methods: {
    timeFormat,
    formatDriver,
    formatPlace,
    updateStatus() {
      const start = moment(this.order?.statusChangedAt);
      const diff = moment().diff(start);
      if (
        moment.duration(diff).asMinutes() >= 15 &&
        this.getStatusById(this.order?.statusId)?.code == "FREE"
      ) {
        this._isFreeMoreThan15Minutes = true;
      } else {
        this._isFreeMoreThan15Minutes = false;
      }
    },
  },
  data() {
    return {
      _isFreeMoreThan15Minutes: false,
      oldStatus: null,
    };
  },
  mounted() {
    this.updateStatus();
    setInterval(() => {
      if (
        this.oldStatus != this.order?.statusId &&
        this.order?.statusId != null
      )
        this.updateStatus();
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>

</style>
