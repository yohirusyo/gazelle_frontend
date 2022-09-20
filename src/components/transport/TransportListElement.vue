<template>
  <div @click="setTransport(transport)" @mouseover="_hovered = transport.id" @mouseleave="_hovered = null">
    <div class="row items-center q-py-md">
      <div class="col-1 text-center">
        <q-checkbox v-model="_selected" :disable="
          !_isNotDisabled
        " />

      </div>
      <div class="col">{{ transport.type }}</div>
      <div class="col">
        <AutoNumber :number="transport?.transportNumber" />
      </div>
      <div class="col-3 column pre text-center">
        {{ formatDriver(getDriverById(transport.driverId)) }}
      </div>
      <div class="col-2 pre text-center">
        {{ formatPlace(getPlaceById(transport.placeId)) }}
      </div>
      <div class="col-2 row justify-center text-center">
        <q-chip :class="_isFreeMoreThan15Minutes ? 'bg-green text-white' : ''">
          {{ getStatusById(transport.statusId)?.isBusy ? "Занят" : "Свободен" }}
          <q-tooltip>
            {{ getStatusById(transport.statusId)?.description }}
          </q-tooltip>
        </q-chip>
      </div>
      <div class="col-1 text-center">
        <q-chip class="q-ma-none" :class="_isBusyMoreThan1Hour ? 'bg-red text-white' : ''">
          {{ duration }}
        </q-chip>
      </div>
    </div>
    <q-separator class="q-ma-none" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { timeFormat, formatDriver, formatPlace, formatTransportNumber } from "src/helpers/formatters";
import AutoNumber from "../base/AutoNumber.vue";
import * as moment from "moment";

export default {
  name: "TransportListElement",
  components: {
    AutoNumber
  },
  props: ["transport", "freeStatuses"],
  computed: {
    ...mapGetters("status", ["getStatusById"]),
    ...mapGetters("user", ["getDriverById"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapState("current", [
      "selectedTransportId",
      "order",
      "orderIsEmergency",
      "hoveredTransportId"
    ]),
    ...mapState('order', ['customerPhoneNumber', 'customerFullname', 'customerSubdivision']),
    _isNotDisabled() {
      if (this.transport.driverId == null) return false;
      if (this.customerSubdivision == this.transport.lastCustomerSubdivision) return true;
      if (this.orderIsEmergency) return true;
      if (this._isFreeMoreThan15Minutes) return true;
      return false;
    },
    _selected: {
      get() {
        return this.selectedTransportId === this.transport.id;
      },
      set(newValue) {
        this.setSelectedTransportId(newValue ? this.transport.id : null);
      },
    },
    _hovered: {
      get() {
        return this.hoveredTransportId;
      },
      set(val) {
        this.setHoveredTransportId(val)
      }
    },
  },
  methods: {
    ...mapMutations("current", ["setTransport", "setSelectedTransportId", "setHoveredTransportId"]),
    timeFormat,
    formatDriver,
    formatPlace,
    formatTransportNumber
  },
  data() {
    return {
      duration: null,
      _isFreeMoreThan15Minutes: false,
      _isBusyMoreThan1Hour: false,

    };
  },
  mounted() {
    setInterval(() => {
      const start = moment(this.transport.statusChangedAt);
      const diff = moment().diff(start);
      if (
        moment.duration(diff).asHours() >= 1 &&
        this.getStatusById(this.transport.statusId).isBusy
      ) {
        this._isBusyMoreThan1Hour = true;
        this._isFreeMoreThan15Minutes = false;
      } else if (
        moment.duration(diff).asMinutes() >= 15 &&
        this.getStatusById(this.transport.statusId).code == 'FREE'
      ) {
        this._isFreeMoreThan15Minutes = true;
        this._isBusyMoreThan1Hour = false;
      } else {
        this._isBusyMoreThan1Hour = false;
        this._isFreeMoreThan15Minutes = false;
      }
      this.duration = moment.utc(diff).format("HH:mm:ss");
    }, 1000);
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
