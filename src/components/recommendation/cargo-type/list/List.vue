<template>
  <VScrolltable
    :rows="cargoTypes"
    :columns="cargoTypesColumns"
    row-key="id"
    :report="false"
  >
    <template v-slot:body="props">
      <q-tr
        :props="props"
        @click="onSelected(props.row)"
        :class="{ 'bg-green': props.row.isRequest }"
      >
        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>
        <q-td key="withEmergency" :props="props">
          {{ props.row.withEmergency ? "Да" : "Нет" }}
        </q-td>
        <q-td key="priority" :props="props">
          {{ getPriorityDescriptionByNumber(props.row.priority) }}
        </q-td>
      </q-tr>
    </template>
  </VScrolltable>
</template>

<script setup>
import VScrolltable from "src/components/base/VScrolltable.vue";
import { defineEmits, inject } from "vue";
import { getPriorityDescriptionByNumber } from "src/components/recommendation/helpers";

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
    name: "withEmergency",
    required: true,
    label: "Аварийность",
    align: "center",
    sortable: false,
    field: (row) => row.withEmergency,
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
