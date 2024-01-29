<template>
  <div
    style="border: 1px solid rgba(0, 0, 0, 0.12)"
    class="q-ma-sm row q-pa-sm items-center"
  >
    <div class="col-5">{{ props.transportType.description }}</div>
    <div class="col-5">
      {{ props.transportType.CargoTypeTransportTypeAssociation.transportPrior }}
    </div>
    <div class="col-2 row justify-end">
      <q-btn
        text-color="white"
        label="Отвязать тип ТС"
        unelevated
        class="border-none bg-red"
        @click="destroyCargoTypeTransportTypeBounding"
        no-caps
        dense
      ></q-btn>
    </div>
  </div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { inject } from "vue";

const props = defineProps({
  transportType: Object,
});

const fetchRelatedTransportTypes = inject("fetchRelatedTransportTypes");

const destroyCargoTypeTransportTypeBounding = async () => {
  await api.delete(
    `/recommendation/bound-cargo-type-to-transport-type/${props.transportType.CargoTypeTransportTypeAssociation.cargoTypeId}/${props.transportType.CargoTypeTransportTypeAssociation.transportTypeI}`
  );
  await fetchRelatedTransportTypes();
};
</script>
