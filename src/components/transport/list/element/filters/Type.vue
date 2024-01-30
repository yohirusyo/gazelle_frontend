<template>
  <q-btn icon="las la-filter" size="0.7rem" dense flat @click.stop>
    <q-menu persistent>
      <q-list style="min-width: 100px">
        <q-item
          style="user-select: none"
          clickable
          v-for="(type, index) of transportTypes"
          :key="type.id"
          :class="isSelected(type.id) ? 'bg-blue-2' : ''"
          @click="isSelected(type.id) ? remove(type.id) : add(type.id)"
        >
          <q-item-section>{{ type.description }} </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["modelValue", "transportTypes"],
  computed: {
    _modelValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
    ...mapGetters("transport", ["getTypes"]),
  },
  methods: {
    isSelected(item) {
      return this._modelValue.includes(item);
    },
    remove(item) {
      const index = this._modelValue.indexOf(item);
      this._modelValue.splice(index, 1);
    },
    add(item) {
      this._modelValue.push(item);
    },
  },
};
</script>
