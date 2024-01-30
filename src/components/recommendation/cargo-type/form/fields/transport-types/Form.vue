<template>
  <q-form
    class="row q-pa-sm"
    style="border: 1px solid rgba(0, 0, 0, 0.12)"
    @submit="handleSubmit"
    @reset="resetForm"
  >
    <q-select
      square
      outlined
      hide-bottom-space
      hide-hint
      class="fit col"
      dense
      flat
      :options="unrelatedTransportTypes"
      :option-label="(item) => item.description"
      :option-value="(item) => item.id"
      v-model="selected"
      label="Тип ТС"
    ></q-select>

    <Priority v-model="priority" class="q-mx-sm col col" />
    <q-btn
      text-color="white"
      label="Привязать тип ТС"
      unelevated
      class="border-none bg-blue-4 col col-shrink"
      type="submit"
      no-caps
      dense
    ></q-btn>
  </q-form>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { api } from "src/boot/axios";
import Priority from "../Priority.vue";

const transportTypes = inject("transportTypes");

const props = defineProps({
  relatedTransportTypes: Array(Object),
  cargoTypeId: Number,
});

const unrelatedTransportTypes = computed(() => {
  return transportTypes.value.filter(
    (t) => !props.relatedTransportTypes.some((tt) => tt.id == t.id)
  );
});

const selected = ref(null);
const priority = ref(0);

const resetForm = () => {
  selected.value = null;
  priority.value = 0;
};

const fetchRelatedTransportTypes = inject("fetchRelatedTransportTypes");

const handleSubmit = async () => {
  await createCargoTypeTransportTypeBounding();
  await fetchRelatedTransportTypes();
  resetForm();
};

const createCargoTypeTransportTypeBounding = async () => {
  const { data } = await api.post(
    `/recommendation/bound-cargo-type-to-transport-type/${props.cargoTypeId}/${selected.value.id}`,
    { priority: priority.value }
  );
};
</script>
