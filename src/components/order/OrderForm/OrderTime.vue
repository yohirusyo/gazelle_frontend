<template>
  <q-btn
    text-color="white"
    no-caps
    unelevated
    class="border-none bg-blue-4"
    color="primary"
  >
    <div class="column">
      <div>Назначить дату поездки</div>
      <div style="font-size: 0.6rem; line-height: 12px">
        {{ moment(_selectedDate).lang("ru").format("D MMM, dddd") }}
      </div>
    </div>
    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
      <q-date v-model="_selectedDate" minimal>
        <div class="row items-center justify-end">
          <q-btn v-close-popup label="Закрыть" color="primary" flat />
        </div>
      </q-date>
    </q-popup-proxy>
  </q-btn>

  <Datepicker
    inputClassName="datepicker col "
    menuClassName="datepicker-menu border-md"
    v-model="_orderTime"
    timePicker
    selectText="Выбрать"
    cancelText="Отмена"
  />

</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import * as moment from "moment";
export default {
  props: ["modelValue", "label"],
  computed: {
    _modelValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
    _orderTime: {
      get() {
        return {
          hours: this._modelValue.getHours(),
          minutes: this._modelValue.getMinutes(),
          seconds: 0,
        };
      },
      set(val) {
        const d = new Date(this._selectedDate);
        d.setHours(val.hours);
        d.setMinutes(val.minutes);
        d.setSeconds(0);
        d.setMilliseconds(0);
        this._modelValue = d;
      },
    },
    _selectedDate: {
      get() {
        return this._modelValue;
      },
      set(val) {
        const d = new Date(val);
        d.setHours(this._orderTime.hours);
        d.setMinutes(this._orderTime.minutes);
        d.setSeconds(0);
        d.setMilliseconds(0);
        this._modelValue = d;
      },
    },
  },
  components: {
    Datepicker,
  },
  methods: {
    moment,
  },
};
</script>
