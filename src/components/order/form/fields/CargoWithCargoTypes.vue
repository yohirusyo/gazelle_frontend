<template>
  <q-select
    square
    outlined
    hide-bottom-space
    hide-hint
    class="q-mb-md fit"
    dense
    flat
    :options="cargoTypesWithOthers"
    :option-label="(item) => item.description"
    :option-value="(item) => item.id"
    v-model="selectedCargoType"
    label="Наименование груза"
  ></q-select>

  <q-input
    v-model.trim="otherName"
    type="text"
    square
    outlined
    dense
    hide-bottom-space
    hide-hint
    label-color="grey"
    label="Описание груза 'Другое'"
    autocomplete="off"
    class="q-mb-md fit"
    v-if="selectedCargoType?.id === -1"
  />

  <q-checkbox
    v-model="withCargoTypeRequest"
    class="q-mb-md fit"
    dense
    v-if="selectedCargoType?.id === -1"
  >
    Создать запрос за создание типа груза
  </q-checkbox>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref, onMounted, computed } from "vue";

const cargoTypes = ref([]);

const props = defineProps({
  otherName: String,
  selectedCargoTypeId: Number,
  withCargoTypeRequest: Boolean,
});

const emit = defineEmits(["update:otherName", "update:selectedCargoTypeId"]);

const selectedCargoType = computed({
  get() {
    return props.selectedCargoTypeId
      ? cargoTypesWithOthers.value.find(
          (ct) => ct.id === props.selectedCargoTypeId
        ) ?? cargoTypesWithOthers.value.find((ct) => ct.id === -1)
      : null;
  },
  set(val) {
    emit("update:selectedCargoTypeId", val.id);
  },
});

const withCargoTypeRequest = computed({
  get() {
    return props.withCargoTypeRequest;
  },
  set(val) {
    emit("update:withCargoTypeRequest", val);
  },
});

const otherName = computed({
  get() {
    return props.otherName;
  },
  set(val) {
    emit("update:otherName", val);
  },
});

const cargoTypesWithOthers = computed(() => [
  ...cargoTypes.value.filter((ct) => ct.isRequest === false),
  {
    description: "Другое",
    id: -1,
  },
]);

const fetchCargoTypes = async () => {
  const { data } = await api.get("/recommendation/cargo-types");
  cargoTypes.value = data;
};

onMounted(async () => {
  await fetchCargoTypes();
});
</script>
