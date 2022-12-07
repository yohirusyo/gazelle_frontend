<template>
  <div class="row border-sm bg-white" @click="setTransport(transport)">
    <div class="col column">
      <div class="q-ma-sm">
        <div class="row justify-between">
          <AutoNumber :number="transport?.transportNumber" />
        </div>
      </div>
      <div class="q-ma-sm">
        {{ transport.type }}
      </div>
      <div class="column q-ma-sm">
        <div>
          {{ formatDriverMobileFullname(getDriverById(transport?.driverId)) }}
        </div>
        <div>
          {{
            formatDriverMobilePhoneNumber(getDriverById(transport?.driverId))
          }}
        </div>
      </div>
    </div>
    <div class="col col-shrink column items-center">
      <TransportStatus :transportId="transport?.id" />
      <q-chip
        class="q-ma-none"
        :class="_isBusyMoreThan1Hour ? 'bg-red text-white' : ''"
      >
        {{ duration }}
      </q-chip>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import BaseCard from "src/components/base/Card.vue";
import AutoNumber from "../base/AutoNumber.vue";
import TransportStatus from "./TransportStatus.vue";
import {
  formatDriverMobileFullname,
  formatDriverMobilePhoneNumber,
} from "src/helpers/formatters";
import * as moment from "moment";
export default {
  name: "TransportListElementMobile",
  components: {
    BaseCard,
    AutoNumber,
    TransportStatus,
  },
  props: ["transport"],
  methods: {
    ...mapMutations("current", ["setTransport"]),
    formatDriverMobileFullname,
    formatDriverMobilePhoneNumber,
    updateStatus() {
      const start = moment(this.transport?.statusChangedAt);
      const diff = moment().diff(start);
      if (
        moment.duration(diff).asHours() >= 1 &&
        this.getStatusById(this.transport?.statusId)?.isBusy
      ) {
        this._isBusyMoreThan1Hour = true;
        this._isFreeMoreThan15Minutes = false;
      } else if (
        moment.duration(diff).asMinutes() >= 15 &&
        this.getStatusById(this.transport?.statusId)?.code == "FREE"
      ) {
        this._isFreeMoreThan15Minutes = true;
        this._isBusyMoreThan1Hour = false;
      } else {
        this._isBusyMoreThan1Hour = false;
        this._isFreeMoreThan15Minutes = false;
      }
    },
  },
  computed: {
    ...mapGetters("status", ["getStatusById"]),
    ...mapGetters("user", ["getDriverById"]),
    ...mapGetters("place", ["getPlaceById"]),
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
    setInterval(() => {
      if (
        this.oldStatus != this.transport?.statusId &&
        this.transport.statusId != null
      )
        this.updateStatus();
      const start = moment(this.transport?.statusChangedAt);
      const diff = moment().diff(start);
      if (moment.duration(diff).asDays() >= 1) {
        this.duration = moment.utc(diff).format("DDд. HH:mm:ss");
      } else {
        this.duration = moment.utc(diff).format("HH:mm:ss");
      }
    }, 1000);
  },
};
</script>
