<template>
 <q-page class="bg-white">
  <q-btn
      label="Отчёт по заказам"
      class="row text-black border-none bg-white q-ma-sm"
      outline
      unelevated
      to="/report"
    />
    <q-btn
      label="Отчёт по водителям"
      class="row text-black border-none bg-white q-ma-sm"
      outline
      unelevated
      to="/report-shifts"
      v-if="
        this.currentUser?.role.includes('ADMIN') ||
        this.currentUser?.role.includes('WATCHER_WITH_REPORTS')
      "
    />
    <q-btn
      label="Отчёт по диспетчерам"
      class="row text-black border-none bg-white q-ma-sm"
      outline
      unelevated
      to="/report-operator-shifts"
      v-if="
        this.currentUser?.role.includes('ADMIN') ||
        this.currentUser?.role.includes('WATCHER_WITH_REPORTS')
      "
    />
    <q-btn
      label="Отчёт по МВЗ"
      class="row text-black border-none bg-white q-ma-sm"
      outline
      unelevated
      to="/report-mvz"
      v-if="
        this.currentUser?.role.includes('ADMIN') ||
        this.currentUser?.role.includes('WATCHER_WITH_REPORTS')
      "
    />
    <q-btn
      label="Отчёт по подразделеням"
      class="row text-black border-none bg-white q-ma-sm"
      outline
      unelevated
      to="/report-subdivision"
      v-if="
        this.currentUser?.role.includes('ADMIN') ||
        this.currentUser?.role.includes('WATCHER_WITH_REPORTS')
      "
    />
 </q-page>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
  ...mapState("current", ["currentUser"]),
  },
  name: "reports"
}
</script>

<style scoped>
.q-btn--outline:before {
    border: 1px solid rgba(0, 0, 0, 0.24) ;
}
</style>
