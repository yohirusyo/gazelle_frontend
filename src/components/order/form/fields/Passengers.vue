<template>
  <q-checkbox v-model="_withPassengers" label="Поедут пассажиры" dense />

  <q-input
    v-if="_withPassengers"
    v-model="_passengerCount"
    type="number"
    :min="isZeroCargo ? 1 : 0"
    square
    outlined
    dense
    hide-bottom-space
    hide-hint
    label-color="grey"
    label="Пассажиров"
    lazy-rules
    :rules="[(val) => (val !== null && val !== '') || 'Обязательное поле!']"
    autocomplete="off"
  />
</template>

<script>
export default {
  props: ["modelValue", "isZeroCargo"],
  computed: {
    _modelValue: {
      get() {
        return this.modelValue;
      },
    },
    _withPassengers: {
      get() {
        return this.modelValue.withPassengers;
      },
      set(val) {
        this.$emit("update:modelValue", {
          ...this.modelValue,
          withPassengers: val,
        });
      },
    },
    _passengerCount: {
      get() {
        return this.modelValue.passengerCount;
      },
      set(val) {
        this.$emit("update:modelValue", {
          ...this.modelValue,
          passengerCount: val,
        });
      },
    },
  },
};
</script>
