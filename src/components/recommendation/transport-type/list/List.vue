<template>
  <VScrolltable
    :rows="transportTypes"
    :columns="transportTypesColumns"
    row-key="id"
    :report="false"
  >
    <template v-slot:body="props">
      <q-tr :props="props" @click="onSelected(props.row)">
        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>
        <q-td key="weight" :props="props">
          {{ props.row.weight }}
        </q-td>
        <q-td key="length" :props="props">
          {{ props.row.length }}
        </q-td>
        <q-td key="width" :props="props">
          {{ props.row.width }}
        </q-td>
        <q-td key="height" :props="props">
          {{ props.row.height }}
        </q-td>
        <q-td key="passengerSeats" :props="props">
          {{ props.row.passengerSeats }}
        </q-td>
      </q-tr>
    </template>
  </VScrolltable>
</template>

<script setup>
import VScrolltable from "src/components/base/VScrolltable.vue";
import { defineEmits, inject } from "vue";

const transportTypes = inject('transportTypes')

const transportTypesColumns = [
  {
    name: "description",
    required: true,
    label: "Описание",
    align: "center",
    sortable: false,
    field: (row) => row.description,
  },
  {
    name: "weight",
    required: true,
    label: "Вес ",
    align: "center",
    sortable: false,
    field: (row) => row.weight,
  },
  {
    name: "length",
    required: true,
    label: "Высота",
    align: "center",
    sortable: false,
    field: (row) => row.length,
  },
  {
    name: "width",
    required: true,
    label: "Ширина",
    align: "center",
    sortable: false,
    field: (row) => row.width,
  },
  {
    name: "height",
    required: true,
    label: "Высота",
    align: "center",
    sortable: false,
    field: (row) => row.height,
  },
  {
    name: "passengerSeats",
    required: true,
    label: "Пассажирских мест",
    align: "center",
    sortable: false,
    field: (row) => row.passengerSeats,
  },
];

const emit = defineEmits(["onSelected"]);

const onSelected = (item) => {
  emit("onSelected", item);
};
</script>
