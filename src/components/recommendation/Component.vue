<template>
  <MenuItemV2 :col="props.col" label="Заказы" v-model="order">
    <template #main="{ height, onSelected }">
      <CargoTypesList @onSelected="onSelected"
    /></template>
    <template #create="{ onDone, selected }">
      <CargoTypesForm :selected="selected"
    /></template>
    <template #menu="{}"> </template>
  </MenuItemV2>
</template>

<script setup>
import MenuItemV2 from "src/components/base/MenuItemV2.vue";
import { ref, defineProps } from "vue";
import CargoTypesList from "./list/List.vue";
import CargoTypesForm from "./form/Form.vue";

const order = ref(null);
const props = defineProps({
  col: Number,
});
</script>

<style></style>
