<template>
  <div :style="`height: ${height}px`" style="background: transparent">
    <BaseCard
      class="bg-white q-pa-sm column q-my-sm q-mx-sm"
      v-for="user of users"
      :key="user.id"
      radius="md"
      @click="setUser(user)"
    >
      <div class="col column">
        <div class="q-ma-sm">
          {{ formatDriverMobileFullname(user) }}
        </div>
        <div class="q-ma-sm">
          {{ formatDriverMobilePhoneNumber(user) }}
        </div>
        <div class="q-ma-sm">
          {{ formatRole(user.role) }}
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import BaseCard from "src/components/base/Card.vue";
import {
  formatDriverMobileFullname,
  formatDriverMobilePhoneNumber,
  formatRole,
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
    ...mapState("user", ["users"]),
  },
  methods: {
    ...mapMutations("current", ["setUser"]),
    formatDriverMobileFullname,
    formatDriverMobilePhoneNumber,
    formatRole,
  },
};
</script>
