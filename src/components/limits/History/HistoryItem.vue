<template>
  <q-tr class="text-center">
    <q-td key="date">{{
      item.order.orderTime
        ? dayjs(item.order.orderTime).format("DD.MM.YYYY HH:mm:ss")
        : "Маршрут"
    }}</q-td>

    <q-td key="id">{{ item.order.id }}</q-td>
    <q-td key="time">{{ toMinutes(time) }}</q-td>
    <q-td key="timeFine" v-if="isMinutes">{{ toMinutes(timeFine) }}</q-td>
    <q-td key="limitMin" v-if="isMinutes">{{ toMinutes(limitMin) }} </q-td>
    <q-td key="limitKilo" v-else>{{ item.order.routeLength ?? 0 }}</q-td>
  </q-tr>
</template>

<script>
import dayjs from "dayjs";
export default {
  props: ["item", "isMinutes"],
  data() {
    return {
      fine: 15 * 60000,
    };
  },
  methods: {
    dayjs,
    toMinutes(time) {
      if (!time) return "0.00";
      return (time / 60000).toFixed(2);
    },
    getLimitWithFine(time) {
      if (!time) return 0;
      return time > this.fine ? (time - this.fine) * 2 + this.fine : time;
    },
    parseNumber(number) {
      if (!number) return 0;
      return Number(number);
    },
  },
  computed: {
    time: {
      get() {
        return (
          this.parseNumber(this.item.driveTime) +
          this.parseNumber(this.item.loadingTime) +
          this.parseNumber(this.item.unloadingTime)
        );
      },
    },
    timeFine: {
      get() {
        const loadingTime =
          !!this.item.loadingTime && this.item.loadingTime > this.fine
            ? (this.item.loadingTime - this.fine) * 2
            : 0;
        const unloadingTime =
          !!this.item.unloadingTime && this.item.unloadingTime > this.fine
            ? (this.item.unloadingTime - this.fine) * 2
            : 0;
        return loadingTime + unloadingTime;
      },
    },
    limitMin: {
      get() {
        const loadingTime = this.getLimitWithFine(
          this.parseNumber(this.item.loadingTime)
        );
        const unloadingTime = this.getLimitWithFine(
          this.parseNumber(this.item.unloadingTime)
        );
        return (
          this.parseNumber(this.item.driveTime) +
          loadingTime +
          unloadingTime
        );
      },
    },
  },
};
</script>
