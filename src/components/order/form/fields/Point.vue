<template>
  <div
    class="q-pa-sm column q-gutter-y-sm"
    style="border: 1px solid rgba(0, 0, 0, 0.12)"
    :class="{ 'bg-red-1': _forDelete }"
  >
    <div v-if="modelValue.existingId" class="text-center">
      Номер заказа {{ modelValue.existingId }}
    </div>
    <div class="row q-mt-none">
      <PlaceSelect
        v-model="_destinationName"
        :label="'Место назначения' + (isSolo ? '' : ` ${index + 1}`)"
        class="col"
      />
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
    <div class="row items-center justify-between">
      <div class="column col-10">
        <PassengersBlock
          v-model="_passenger"
          :isZeroCargo="!_cargo.withCargo"
        />
        <CargoBlock
          v-model="_cargo"
          :withoutPassengers="!_passenger.withPassengers"
        />
      </div>
     
      <div class="col-1"> <q-btn
        v-if="!isSolo && !isFirst && !_forDelete && ((_modelValue.statusId == 1 || _modelValue.statusId == 2) || _modelValue.isNew)"
        class="q-mr-sm"
        text-color="red"
        unelevated
        icon="close"
        flat
        @click="onRemoveCombinedOrder(_modelValue.id)"
      >
        <q-tooltip> Удалить точку из маршрута </q-tooltip>
      </q-btn></div>
      <div class="column col-1">
        <!-- {{index}}
        {{points[0].statusId}}
        {{_modelValue.statusId == 8}} -->

        <q-btn
          flat
          color="primary"
          icon="arrow_upward"
          @click="elUp(index)"
          size="sm"
          v-if="!isFirst && (((_modelValue.isNew || copyMode) || (_modelValue.statusId == 1 || _modelValue.statusId == 2)) && (points[index-1]?.statusId == 1 || points[index-1]?.statusId == 2 || points[index-1]?.statusId == null))"
        />
        <q-btn
          flat
          color="primary"
          icon="arrow_downward"
          @click="elDown(index)"
          size="sm"
          v-if="!isLast && ((_modelValue.isNew || copyMode) || (_modelValue.statusId == 1 || _modelValue.statusId == 2))"
        />
      </div>
    </div>
    
    <CustomerSelect
      v-if="_withCargo"
      :phoneNumber="_cargoRecieverPhoneNumber"
      :fullname="_cargoRecieverFullname"
      :subdivision="_cargoRecieverSubdivision"
      :mvz="_cargoRecieverMvz"
      @update:phoneNumber="(val) => (_cargoRecieverPhoneNumber = val)"
      @update:fullname="(val) => (_cargoRecieverFullname = val)"
      @update:subdivision="(val) => (_cargoRecieverSubdivision = val)"
      @update:mvz="(val) => (_cargoRecieverMvz = val)"
      :notRequired="true"
      customLabel="Грузополучатель"
      :noWrite="true"
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
import CustomerSelect from "src/components/customer/form/fields/Customer.vue";
import { mapState } from "vuex";
export default {
  props: ["modelValue", "label", "isSolo", "index", "isFirst", "isLast", "initPointsLength", "copyMode", "points"],
  components: {
    ISelect,
    PlaceSelect,
    PassengersBlock,
    CargoBlock,
    ContactSelect,
    CustomerSelect,
  },
  methods: {
    onRemoveCombinedOrder(id) {
      this.$emit("remove", id);
    },
    onRestoreCombinedOrder(id) {
      this.$emit("restore", id);
    },
    elUp(index) {
      this.$emit("elUp", index);
    },
    elDown(index) {
      this.$emit("elDown", index);
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
    _withCargo: {
      get() {
        return this.modelValue.cargo.withCargo;
      },
    },
    _forDelete: {
      get() {
        return !!this._modelValue.forDelete;
      },
    },

    _cargoRecieverPhoneNumber: {
      get() {
        return this._cargo.cargoReciever.phoneNumber;
      },
      set(val) {
        this._cargo.cargoReciever.phoneNumber = val;
        this.$emit("update:modelValue", { ...this.modelValue });
      },
    },
    _cargoRecieverFullname: {
      get() {
        return this._cargo.cargoReciever.fullname;
      },
      set(val) {
        this._cargo.cargoReciever.fullname = val;
        this.$emit("update:modelValue", { ...this.modelValue });
      },
    },
    _cargoRecieverSubdivision: {
      get() {
        return this._cargo.cargoReciever.subdivision;
      },
      set(val) {
        this._cargo.cargoReciever.subdivision = val;
        this.$emit("update:modelValue", { ...this.modelValue });
      },
    },
    _cargoRecieverMvz: {
      get() {
        return this._cargo.cargoReciever.mvz;
      },
      set(val) {
        this._cargo.cargoReciever.mvz = val;
        this.$emit("update:modelValue", { ...this.modelValue });
      },
    },
  },
};
</script>
