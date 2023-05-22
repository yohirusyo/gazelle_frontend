<template>
  <div class="fit column items-center justify-center">
    <q-btn
      dense
      icon="las la-compress-arrows-alt"
      @click.stop="_modelValue = !_modelValue"
      flat
      v-if="_modelValue"
    >
      <q-tooltip> Скрыть маршрут </q-tooltip>
    </q-btn>
    <q-btn
      dense
      icon="las la-expand-arrows-alt"
      @click.stop="_modelValue = !_modelValue"
      flat
      v-else
    >
      <q-tooltip> Показать маршрут </q-tooltip>
    </q-btn>
    <span>
        {{ routeId }}
        <q-tooltip> Номер маршрута </q-tooltip>
    </span>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  props: ["orderId", "modelValue", "routeId"],
  computed: {
    ...mapGetters("order", ["isExpanded"]),
    _modelValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
  methods: {
    ...mapMutations("order", ["addToExpanded", "removeFromExpanded"]),
  },
};
</script>
