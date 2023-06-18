<template>
  <ISelect
    :options="contacts"
    v-model="_contactFullname"
    :labelFn="(item) => `${item.fullname} ${item.phoneNumber}`"
    label="Контактное лицо"
    @selected="
      (val) => {
        _contactFullname = val?.fullname;
        _contactPhoneNumber = val?.phoneNumber;
      }
    "
  />
  <q-input
    v-model="_contactPhoneNumber"
    type="text"
    square
    outlined
    dense
    hide-bottom-space
    hide-hint
    label-color="grey"
    label="Телефон"
    mask="+7 (###) ### ## ##"
    autocomplete="off"
  />
</template>

<script>
import ISelect from "components/base/ISelect.vue";
import { mapState } from "vuex";
export default {
  props: ["fullname", "phoneNumber"],
  computed: {
    ...mapState("contact", ["contacts"]),
    _contactFullname: {
      get() {
        return this.fullname;
      },
      set(val) {
        this.$emit("update:fullname", val);
      },
    },
    _contactPhoneNumber: {
      get() {
        return this.phoneNumber;
      },
      set(val) {
        this.$emit("update:phoneNumber", val);
      },
    },
  },
  components: {
    ISelect,
  },
};
</script>
