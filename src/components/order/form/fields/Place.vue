<template>
  <ISelect :options="filteredPlaces" v-model="_modelValue" :labelFn="(item) => item.name" :label="label"
    @selected="setPlace" :required="true" :noWrite="true"/>
</template>

<script>
import ISelect from "components/base/ISelect.vue";
import { mapState } from "vuex";
import { getConnection } from "src/boot/axios";
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
    filteredPlaces: {
      get() {
        return this.places.filter((p) => {
          if (this._isMetiz) {
            return !p.isDeleted && p.addedManualy
          } else {
            return !p.isDeleted && !p.addedManualy
          }
        });
      },
    },
    _isMetiz: {
      get() {
        return getConnection() == "mmkmetiz";
      },
    }
  },
  components: {
    ISelect,
  },
  methods: {
    setPlace(item) {
      this.$emit("update:modelValue", item?.name);
    },
  },
};
</script>
