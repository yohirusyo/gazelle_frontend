<template>
  <q-chip class="bg-orange" v-if="driver?.isOnLunch"> Обед </q-chip>
  <q-chip :class="_isFreeMoreThan15Minutes ? 'bg-green text-white' : ''" v-else>
    {{ getStatusById(transport?.statusId)?.isBusy ? "Занят" : "Свободен" }}
    <q-tooltip>
      {{ getStatusById(transport?.statusId)?.description }}
    </q-tooltip>
  </q-chip>
</template>

<script>
import { mapGetters } from "vuex";
import {
  timeFormat,
  formatDriver,
  formatPlace,
  formatTransportNumber,
} from "src/helpers/formatters";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
export default {
  name: "TransportStatus",
  props: ["transportId"],
  computed: {
    ...mapGetters("status", ["getStatusById"]),
    ...mapGetters("transport", ["getTransportById"]),
    ...mapGetters("user", ["getDriverById"]),
    transport: {
      get() {
        return this.getTransportById(this.transportId);
      },
    },
    driver: {
      get() {
        return this.getDriverById(this.transport.driverId);
      },
    },
  },
  methods: {
    timeFormat,
    formatDriver,
    formatPlace,
    formatTransportNumber,
    updateStatus() {
      const start = dayjs(this.transport?.statusChangedAt);
      const diff = dayjs().diff(start);
      if (
        dayjs.duration(diff).asMinutes() >= 15 &&
        this.getStatusById(this.transport?.statusId)?.code == "FREE"
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
        this.oldStatus != this.transport?.statusId &&
        this.transport?.statusId != null
      )
        this.updateStatus();
    }, 1000);
  },
};
</script>

<style lang="scss" scoped></style>
