<template>
  <q-select
    square
    outlined
    hide-bottom-space
    hide-hint
    dense
    flat
    :options="priorityList"
    :option-label="(item) => item.description"
    :option-value="(item) => item.id"
    v-model="model"
    label="Приоритет"
  ></q-select>
</template>

<script setup>
import { computed } from "vue";
import { priorityList } from "src/components/recommendation/helpers";

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return priorityList.find((p) => p.id === props.modelValue);
  },
  set(value) {
    return emit("update:modelValue", value?.id);
  },
});
</script>
