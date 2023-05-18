<template>
  <div class="row  bg-white" @click="setTransport(transport)">
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
import AutoNumber from "src/components/base/AutoNumber.vue";
import TransportStatus from "src/components/transport/TransportStatus.vue";
import {
  formatDriverMobileFullname,
  formatDriverMobilePhoneNumber,
} from "src/helpers/formatters";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
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
      const start = dayjs(this.transport?.statusChangedAt);
      const diff = dayjs().diff(start);
      if (dayjs.duration(diff).asDays() >= 1) {
        this.duration = dayjs.utc(diff).format("DDд. HH:mm:ss");
      } else {
        this.duration = dayjs.utc(diff).format("HH:mm:ss");
      }
    }, 1000);
  },
};
</script>
