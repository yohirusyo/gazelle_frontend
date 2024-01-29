<template>
  <q-page class="row bg-white">
    <div
      class="col"
      :class="{ 'q-pa-md': !$q.screen.xs }"
      style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <CargoType
        :col="12"
      />
    </div>
    <div
      class="col"
      :class="{ 'q-pa-md': !$q.screen.xs }"
      style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <TransportType :col="12"  />
    </div>
  </q-page>
</template>

<script setup>
import CargoType from "src/components/recommendation/cargo-type/Component.vue";
import TransportType from "src/components/recommendation/transport-type/Component.vue";
import { api } from "src/boot/axios";
import { ref, onMounted, provide } from "vue";

const cargoTypes = ref([]);
const transportTypes = ref([]);

const fetchCargoTypes = async () => {
  const { data } = await api.get("/recommendation/cargo-types");
  cargoTypes.value = data;
};

const fetchTransportTypes = async () => {
  const { data } = await api.get("/recommendation/transport-types");
  transportTypes.value = data;
};

provide("fetchCargoTypes", fetchCargoTypes);
provide("fetchTransportTypes", fetchTransportTypes);
provide("transportTypes", transportTypes);
provide("cargoTypes", cargoTypes);

onMounted(async () => {
  await fetchCargoTypes();
  await fetchTransportTypes();
});
</script>
