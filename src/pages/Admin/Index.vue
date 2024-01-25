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
    />
    <q-btn
      label="Отчёт по диспетчерам"
      class="row text-black border-none bg-white q-ma-sm"
      outline
      unelevated
      to="/report-operator-shifts"
    />
    <q-btn
      label="Отчёт по МВЗ"
      class="row text-black border-none bg-white q-ma-sm"
      outline
      unelevated
      to="/report-mvz"
    />
    <q-btn
      label="Отчёт по подразделеням"
      class="row text-black border-none bg-white q-ma-sm"
      outline
      unelevated
      to="/report-subdivision"
    />
 </q-page>
</template>

<script>
export default {
  name: "reports"
}
</script>

<style scoped>
.q-btn--outline:before {
    border: 1px solid rgba(0, 0, 0, 0.24) ;
}
</style>
