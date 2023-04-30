<template>
  <div
    class="q-pa-sm column q-gutter-y-sm"
    style="border: 1px solid rgba(0, 0, 0, 0.12)"
    :class="{ 'bg-red-1': _forDelete }"
  >
    <div class="row q-mt-none">
      <PlaceSelect
        v-model="_destinationName"
        :label="'Место назначения' + (isSolo ? '' : ` ${index + 1}`)"
        class="col"
      />
      <q-btn
        v-if="!isSolo && !isFirst && !_forDelete"
        class="q-ml-sm"
        text-color="red"
        unelevated
        icon="close"
        flat
        @click="onRemoveCombinedOrder(_modelValue.id)"
      >
        <q-tooltip> Удалить точку из маршрута </q-tooltip>
      </q-btn>
      <q-btn
        v-if="!isSolo && !isFirst && !!_forDelete"
        class="q-ml-sm"
        text-color="red"
        unelevated
        icon="settings_backup_restore"
        flat
        @click="onRestoreCombinedOrder(_modelValue.id)"
      >
        <q-tooltip> Отменить удаление точки из маршрута </q-tooltip>
      </q-btn>
    </div>

    <PassengersBlock v-model="_passenger" :isZeroCargo="!_cargo.withCargo" />
    <CargoBlock
      v-model="_cargo"
      :withoutPassengers="!_passenger.withPassengers"
    />
    <ContactSelect
      :fullname="_contactFullname"
      :phoneNumber="_contactPhoneNumber"
      @update:fullname="(val) => (_contactFullname = val)"
      @update:phoneNumber="(val) => (_contactPhoneNumber = val)"
    />
  </div>
</template>

<script>
import ISelect from "components/base/ISelect.vue";
import PlaceSelect from "./Place.vue";
import PassengersBlock from "./Passengers.vue";
import CargoBlock from "./Cargo.vue";
import ContactSelect from "./Contact.vue";
import { mapState } from "vuex";
export default {
  props: ["modelValue", "label", "isSolo", "index", "isFirst"],
  components: {
    ISelect,
    PlaceSelect,
    PassengersBlock,
    CargoBlock,
    ContactSelect,
  },
  methods: {
    onRemoveCombinedOrder(id) {
      this.$emit("remove", id);
    },
    onRestoreCombinedOrder(id) {
      this.$emit("restore", id);
    },
  },
  computed: {
    ...mapState("place", ["places"]),
    _modelValue: {
      get() {
        return this.modelValue;
      },
    },
    _destinationName: {
      get() {
        return this._modelValue.destinationName;
      },
      set(val) {
        this.$emit("update:modelValue", {
          ...this.modelValue,
          destinationName: val,
        });
      },
    },
    _passenger: {
      get() {
        return this._modelValue.passenger;
      },
      set(val) {
        this.$emit("update:modelValue", { ...this.modelValue, passenger: val });
      },
    },
    _contactFullname: {
      get() {
        return this._passenger.contact.fullname;
      },
      set(val) {
        this._passenger.contact.fullname = val;
        this.$emit("update:modelValue", { ...this.modelValue });
      },
    },
    _contactPhoneNumber: {
      get() {
        return this._passenger.contact.phoneNumber;
      },
      set(val) {
        this._passenger.contact.phoneNumber = val;
        this.$emit("update:modelValue", { ...this.modelValue });
      },
    },
    _cargo: {
      get() {
        return this._modelValue.cargo;
      },
      set(val) {
        this.$emit("update:modelValue", { ...this.modelValue, cargo: val });
      },
    },
    _forDelete: {
      get() {
        return !!this._modelValue.forDelete;
      },
    },
  },
};
</script>
