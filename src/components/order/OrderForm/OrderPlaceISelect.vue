<template>
  <ISelect
    :options="places"
    v-model="_modelValue"
    :labelFn="(item) => item.name"
    :label="label"
    @selected="setPlace"
    :required="true"
  />
</template>

<script>
import ISelect from "components/base/ISelect.vue";
import { mapState } from "vuex";
export default {
  props: ["modelValue", "label"],
  computed: {
    ...mapState("place", ["places"]),
    _modelValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
  components: {
    ISelect,
  },
  methods: {
    setPlace(item) {
      this.$emit("update:modelValue", item.name);
    },
  },
};
</script>
