<template>
  <q-page class="row bg-white">
    <div
      class="col"
      :class="{ 'q-pa-md': !$q.screen.xs }"
      style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <CargoType :col="12" />
    </div>
    <div
      class="col"
      :class="{ 'q-pa-md': !$q.screen.xs }"
      style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <TransportType :col="12" />
    </div>
  </q-page>
</template>

<script setup>
import CargoType from "src/components/recommendation/cargo-type/Component.vue";
import TransportType from "src/components/recommendation/transport-type/Component.vue";
</script>
