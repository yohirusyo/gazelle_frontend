<template>
   <div :style="`height: 100%`" class="q-gutter-y-sm">
    <div
      class="column border-sm bg-white"
      v-for="user of users"
      :key="user.id"
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
    </div>
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
