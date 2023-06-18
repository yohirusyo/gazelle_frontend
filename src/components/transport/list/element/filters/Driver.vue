<template>
  <q-btn icon="las la-filter" size="0.7rem" dense flat @click.stop>
    <q-menu persistent>
      <q-list style="min-width: 100px">
        <q-item
          style="user-select: none"
          clickable
          v-for="(driver, index) of getDrivers"
          :key="driver"
          :class="isSelected(driver) ? 'bg-blue-2' : ''"
          @click="isSelected(driver) ? remove(driver) : add(driver)"
        >
          <q-item-section
            >{{ formatDriverMobileFullname(getDriverById(driver)) }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDriverMobileFullname } from "src/helpers/formatters";
export default {
  props: ["modelValue"],
  computed: {
    _modelValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
    ...mapGetters("transport", ["getDrivers"]),
    ...mapGetters("user", ["getDriverById"]),
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
    formatDriverMobileFullname
  },
};
</script>
