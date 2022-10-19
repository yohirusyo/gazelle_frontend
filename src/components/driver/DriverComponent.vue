<template>
  <MenuItem :col="col" label="Водители" v-model="driver">
    <template #main="{ height }">
      <DriverList :col="col" v-if="!$q.screen.xs" :height="height" />
      <DriverListMobile :col="col" v-else :height="height" />
    </template>
    <template #create="{ height, onDone }">
      <DriverCreation :height="height" @done="onDone" />
    </template>
  </MenuItem>
</template>

<script>
import DriverList from "./DriverList.vue";
import DriverListMobile from "./DriverListMobile.vue";
import DriverCreation from "./DriverCreation.vue";
import { mapState } from "vuex";
import MenuItem from "src/components/base/MenuItem.vue";
export default {
  name: "Driver",
  components: {
    DriverList,
    DriverCreation,
    MenuItem,
    DriverListMobile,
  },
  props: ["col"],
  computed: {
    ...mapState("current", ["driver"]),
  },
};
</script>

<style></style>
