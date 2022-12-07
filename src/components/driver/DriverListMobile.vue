<template>
  <div :style="`height: 100%`" class="q-gutter-y-sm">
    <div
      class="column border-sm bg-white"
      v-for="driver of drivers"
      :key="driver.id"
      @click="setDriver(driver)"
    >
      <div class="col column">
        <div class="q-ma-sm">
          {{ formatDriverMobileFullname(driver) }}
        </div>
        <div class="q-ma-sm">
          {{ formatDriverMobilePhoneNumber(driver) }}
        </div>
        <div
          class="q-ma-sm"
          :class="
            driver.isOnDriverShift && version != driver.version
              ? 'text-red'
              : ''
          "
        >
          Смена:
          {{
            driver.isOnDriverShift
              ? `Да (Версия: ${driver.version ?? "1.1.0 или ниже"})`
              : "Нет"
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import BaseCard from "src/components/base/Card.vue";
import {
  formatDriverMobileFullname,
  formatDriverMobilePhoneNumber,
} from "src/helpers/formatters";
export default {
  name: "DriverListMobile",
  props: ["col", "height"],
  components: {
    BaseCard,
  },
  data() {
    return {
      version: "1.1.3",
    };
  },
  computed: {
    ...mapState("user", ["drivers"]),
  },
  methods: {
    ...mapMutations("current", ["setDriver"]),
    formatDriverMobileFullname,
    formatDriverMobilePhoneNumber,
  },
};
</script>
