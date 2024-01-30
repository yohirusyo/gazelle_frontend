<template>
  <q-input
    v-model.trim="model"
    type="text"
    square
    outlined
    dense
    hide-bottom-space
    hide-hint
    label-color="grey"
    label="Описание"
    autocomplete="off"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    return emit("update:modelValue", value);
  },
});
</script>
