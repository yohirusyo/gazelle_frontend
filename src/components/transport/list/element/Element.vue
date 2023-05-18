<template>
  <q-tr @click="onSelected(transport)" class="text-center">
    <q-td
      key="select "
      class="col-1 text-center"
      v-if="!currentUser?.role.includes('WATCHER')"
    >
      <q-checkbox v-model="_selected" :disable="!_isNotDisabled" dense />
    </q-td>

    <q-td key="type">{{ transport?.type }}</q-td>
    <q-td
      key="number"
      @mouseover="_hovered = transport?.id"
      @mouseleave="_hovered = null"
    >
      <div class="row justify-center">
        <AutoNumber :number="transport?.transportNumber" />
      </div>
    </q-td>
    <q-td key="driver" class="pre">
      {{ formatDriver(getDriverById(transport?.driverId)) }}
    </q-td>
    <q-td key="place">
      {{ formatPlace(getPlaceById(transport?.placeId)) }}
    </q-td>
    <q-td key="status">
      <TransportStatus :transportId="transport?.id" />
    </q-td>
    <q-td key="time">
      <q-chip
        class="q-ma-none"
        :class="_isBusyMoreThan1Hour ? 'bg-red text-white' : ''"
      >
        {{ duration }}
      </q-chip>
    </q-td>
  </q-tr>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import {
  timeFormat,
  formatDriver,
  formatPlace,
  formatTransportNumber,
} from "src/helpers/formatters";
import AutoNumber from "src/components/base/AutoNumber.vue";
import TransportStatus from "src/components/transport/TransportStatus.vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
export default {
  name: "TransportListElement",
  components: {
    AutoNumber,
    TransportStatus,
  },
  props: ["id", "freeStatuses", "selected"],
  computed: {
    ...mapGetters("status", ["getStatusById"]),
    ...mapGetters("user", ["getDriverById"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("transport", ["getTransportById"]),
    ...mapState("current", ["currentUser"]),
    ...mapState("current", [
      "selectedTransportId",
      "orderIsEmergency",
      "hoveredTransportId",
    ]),
    ...mapState("order", [
      "customerPhoneNumber",
      "customerFullname",
      "customerSubdivision",
    ]),
    transport: {
      get() {
        return this.getTransportById(this.id);
      },
    },
    _isNotDisabled() {
      if (this.customerSubdivision == this.transport?.lastCustomerSubdivision)
        return true;
      if (this.orderIsEmergency) return true;
      if (this._isFreeMoreThan15Minutes) return true;
      return false;
    },

    _selected: {
      get() {
        return this.selectedTransportId === this.transport?.id;
      },
      set(newValue) {
        this.setSelectedTransportId(newValue ? this.transport?.id : null);
      },
    },
    _hovered: {
      get() {
        return this.hoveredTransportId;
      },
      set(val) {
        this.setHoveredTransportId(val);
      },
    },
  },
  methods: {
    ...mapMutations("current", [
      // "setTransport",
      "setSelectedTransportId",
      "setHoveredTransportId",
    ]),
    timeFormat,
    formatDriver,
    formatPlace,
    formatTransportNumber,
    updateStatus() {
      const start = dayjs(this.transport?.statusChangedAt);
      const diff = dayjs().diff(start);
      if (
        dayjs.duration(diff).asHours() >= 1 &&
        this.getStatusById(this.transport?.statusId)?.isBusy
      ) {
        this._isBusyMoreThan1Hour = true;
        this._isFreeMoreThan15Minutes = false;
      } else if (
        dayjs.duration(diff).asMinutes() >= 15 &&
        this.getStatusById(this.transport?.statusId)?.code == "FREE"
      ) {
        this._isFreeMoreThan15Minutes = true;
        this._isBusyMoreThan1Hour = false;
      } else {
        this._isBusyMoreThan1Hour = false;
        this._isFreeMoreThan15Minutes = false;
      }
    },
    updateDuration() {
      const start = dayjs(this.transport?.statusChangedAt);
      const diff = dayjs().diff(start);
      if (dayjs.duration(diff).asDays() >= 1) {
        this.duration = dayjs.utc(diff).format("DDд. HH:mm");
      } else {
        this.duration = dayjs.utc(diff).format("HH:mm");
      }
    },
    onSelected(sel) {
      this.$emit("onSelected", sel);
    },
  },
  data() {
    return {
      duration: null,
      _isFreeMoreThan15Minutes: false,
      _isBusyMoreThan1Hour: false,
      oldStatus: null,
    };
  },
  mounted() {
    this.updateStatus();
    this.updateDuration();
    setInterval(() => {
      if (
        this.oldStatus != this.transport?.statusId &&
        this.transport.statusId != null
      )
        this.updateStatus();
      this.updateDuration();
    }, 1000 * 60);
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
