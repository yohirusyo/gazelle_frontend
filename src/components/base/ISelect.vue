<template>
  <q-select
    :modelValue="_modelValue"
    use-input
    fill-input
    hide-selected
    input-debounce="0"
    :options="_filteredOptions"
    @filter="filterFn"
    @input-value="setModel"
    :label="label"
    :option-value="(item) => item"
    :lazy-rules="required"
    :rules="
      required
        ? [(val) => (val !== null && val !== '') || 'Обязательное поле!']
        : []
    "
    square
    outlined
    hide-bottom-space
    hide-hint
    class="fit"
    dense
    autocomplete="off"
    :flat="flat"
  >
    <template v-slot:option="{ index, opt, itemProps, itemEvents }">
      <q-item
        v-bind="itemProps"
        v-on="itemEvents"
        @click="selected(index)"
      >
        <q-item-section>
          <q-item-label>{{ opt }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:append>
      <q-icon
        v-if="_modelValue"
        name="cancel"
        @click.stop.prevent="setModel(null)"
        class="cursor-pointer"
      />
    </template>
  </q-select>
</template>

<script>
export default {
  name: "ISelect",
  props: ["modelValue", "options", "labelFn", "label", "required", "flat"],
  data() {
    return {
      filter: "",
    };
  },
  computed: {
    _modelValue: {
      get() {
        return this.modelValue;
      },
    },
    _filteredOptions: {
      get() {
        return this._filteredValues.map(this.labelFn);
      },
    },
    _filteredValues: {
      get() {
        return this.options.filter((item) =>
          this.labelFn(item).toLowerCase().includes(this.filter)
        );
      },
    },
  },
  methods: {
    filterFn(val, update, abort) {
      update(() => {
        this.filter = val.toLowerCase();
      });
    },
    updateValue(event) {
      this.$emit("update:modelValue", event.target.value);
    },
    setModel(value) {
      this.$emit("update:modelValue", value);
    },
    selected(index) {
      this.$emit("selected", this._filteredValues[index]);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
