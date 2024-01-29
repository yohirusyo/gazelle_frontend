<template>
  <VScrolltable
    :rows="cargoTypes"
    :columns="cargoTypesColumns"
    row-key="id"
    :report="false"
  >
    <template v-slot:body="props">
      <q-tr :props="props" @click="onSelected(props.row)">
        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>
        <q-td key="priority" :props="props">
          {{ props.row.priority }}
        </q-td>
      </q-tr>
    </template>
  </VScrolltable>
</template>

<script setup>
import VScrolltable from "src/components/base/VScrolltable.vue";
import { defineEmits, inject } from "vue";

const cargoTypes = inject("cargoTypes");

const cargoTypesColumns = [
  {
    name: "description",
    required: true,
    label: "Описание",
    align: "center",
    sortable: false,
    field: (row) => row.description,
  },
  {
    name: "priority",
    required: true,
    label: "Приоритет груза",
    align: "center",
    sortable: false,
    field: (row) => row.priority,
  },
];

const emit = defineEmits(["onSelected"]);

const onSelected = (item) => {
  emit("onSelected", item);
};
</script>
