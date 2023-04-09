<template>
  <ISelect
    :options="customers"
    v-model="_fullname"
    :labelFn="
      (item) => `${item.fullname} ( ${item.subdivision} ) ${item.phoneNumber}`
    "
    label="Ответственный"
    @selected="
      (item) => {
        _fullname = item.fullname;
        _subdivision = item.subdivision;
        _phoneNumber = item.phoneNumber;
      }
    "
    :required="true"
  />
  <ISelect
    :options="subdivisions"
    v-model="_subdivision"
    :labelFn="(item) => item.name"
    label="Подразделение"
    @selected="(item) => (_subdivision = item.name)"
    :required="true"
  />
  <q-input
    v-model="_phoneNumber"
    type="text"
    square
    outlined
    dense
    hide-bottom-space
    hide-hint
    label-color="grey"
    label="Телефон"
    mask="+7 (###) ### ## ##"
    lazy-rules
    :rules="[(val) => (val !== null && val !== '') || 'Обязательное поле!']"
    autocomplete="off"
  />
</template>

<script>
import ISelect from "components/base/ISelect.vue";
import { mapState, mapGetters } from "vuex";
export default {
  props: ["phoneNumber", "fullname", "subdivision"],
  computed: {
    ...mapState("customer", ["customers"]),
    ...mapGetters("customer", ["subdivisions"]),
    _fullname: {
      get() {
        return this.fullname;
      },
      set(val) {
        this.$emit("update:fullname", val);
      },
    },
    _phoneNumber: {
      get() {
        return this.phoneNumber;
      },
      set(val) {
        this.$emit("update:phoneNumber", val);
      },
    },
    _subdivision: {
      get() {
        return this.subdivision;
      },
      set(val) {
        this.$emit("update:subdivision", val);
      },
    },
  },
  components: {
    ISelect,
  },
};
</script>
