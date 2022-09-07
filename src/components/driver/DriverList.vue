<template>
  <div class="row items-center col col-shrink q-pr-md">
    <div class="col-7">ФИО</div>
    <div class="col-3">Номер телефона</div>
    <div class="col-2 text-center">На смене</div>
  </div>
  <q-separator spaced />
  <q-scroll-area class="col q-pr-md">
    <div v-for="driver in drivers" :key="driver.id" @click="setDriver(driver)">
      <div class="row items-center">
        <div class="col-7">{{ `${driver.surname} ${driver.name} ${driver.middlename}` }}</div>
        <div class="col-3">{{ driver.workingPhoneNumber }}</div>
        <div class="col-2 text-center">{{ driver.isOnDriverShift ? 'Да' : "Нет" }}</div>
      </div>
      <q-separator spaced inset />
    </div>
  </q-scroll-area>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "DriverList",
  computed: {
    ...mapState("user", ["drivers"]),
  },
  methods: {
    ...mapActions("user", ["requestDrivers"]),
    ...mapMutations("current", ["setDriver"]),
  },
  async mounted() {
    await this.requestDrivers();
  },
};
</script>

<style>
</style>
