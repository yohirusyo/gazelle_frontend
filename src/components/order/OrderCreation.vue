<template>
  <q-form
    @submit="onAddOrder"
    @reset="resetForm"
    class="col column justify-between"
    ref="form"
  >
    <div class="col row q-mb-md">
      <q-scroll-area class="col">
        <div class="column col q-gutter-y-md">
          <div class="row items-center">
            <div class="col q-px-sm">
              <q-input
                v-model="_name"
                type="text"
                borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset"
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Наименование груза"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                :autocomplete="false"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col q-px-sm">
              <q-input
                v-model="_description"
                type="text"
                borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset"
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Комментарий"
                :autocomplete="false"
              />
            </div>
          </div>

          <div class="row items-stretch">
            <div class="col-8 q-px-sm">
              <q-select
                class="bg-grey-2 q-px-md border-sm shadow-white-inset"
                fill-input
                hide-selected
                use-input
                input-debounce="0"
                :options="getFilteredCustomers(_filterCustomers)"
                @filter="filterFnCustomers"
                @input-value="_setCustomerFullname"
                :model-value="customerFullname"
                borderless
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Заказчик"
                :autocomplete="false"
              >
                <template v-slot:option="{ opt, itemProps, itemEvents }">
                  <q-item
                    v-bind="itemProps"
                    v-on="itemEvents"
                    @click="onCustomerSelect(opt)"
                  >
                    <q-item-section>
                      <q-item-label>{{ opt.fullname }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-4 q-px-sm">
              <q-input
                v-model="_customerPhoneNumber"
                type="text"
                borderless
                class="bg-grey-2 border-sm shadow-white-inset q-px-md"
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Телефон"
                mask="+7 (###) ### ## ##"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                :autocomplete="false"
              />
            </div>
          </div>
          <div class="row items-stretch">
            <div class="col-8 q-px-sm">
              <q-select
                class="bg-grey-2 border-sm q-px-md shadow-white-inset"
                fill-input
                hide-selected
                use-input
                input-debounce="0"
                :options="getFilteredContacts(_filterContacts)"
                @filter="filterFnContacts"
                @input-value="_setContactFullname"
                :model-value="contactFullname"
                borderless
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Контактное лицо"
                :autocomplete="false"
              >
                <template v-slot:option="{ opt, itemProps, itemEvents }">
                  <q-item
                    v-bind="itemProps"
                    v-on="itemEvents"
                    @click="onContactSelect(opt)"
                  >
                    <q-item-section>
                      <q-item-label>{{ opt.fullname }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-4 q-px-sm">
              <q-input
                v-model="_contactPhoneNumber"
                type="text"
                borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset"
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Телефон"
                mask="+7 (###) ### ## ##"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                :autocomplete="false"
              />
            </div>
          </div>
          <div class="row items-stretch">
            <div class="col-5 q-px-sm row">
              <q-select
                v-model="_departurePoint"
                type="text"
                borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset col"
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Выберите место отправления"
                :options="places"
                :option-label="(item) => item.name"
                :option-value="(item) => item.id"
                clearable
                :autocomplete="false"
              >
                <template v-slot:append>
                  <q-btn
                    color="primary"
                    icon="las la-map-marker"
                    flat
                    rounded
                    class="q-ml-sm"
                    :disable="!place"
                    @click.stop="
                      () => {
                        _departurePoint = place;
                        setPlace(null);
                      }
                    "
                  />
                </template>
              </q-select>
            </div>
            <div class="col-5 q-px-sm">
              <q-select
                v-model="_destination"
                type="text"
                borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset"
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Выберите место назначения"
                :options="places"
                :option-label="(item) => item.name"
                :option-value="(item) => item.id"
                clearable
                :autocomplete="false"
              >
                <template v-slot:append>
                  <q-btn
                    color="primary"
                    icon="las la-map-marker"
                    flat
                    rounded
                    class="q-ml-sm"
                    :disable="!place"
                    @click.stop="
                      () => {
                        _destination = place;
                        setPlace(null);
                      }
                    "
                  />
                </template>
              </q-select>
            </div>
            <div class="col-2 q-px-sm row">
              <div
                class="bg-grey-2 border-sm shadow-white-inset col row items-center justify-center"
              >
                <Datepicker
                  inputClassName="datepicker col"
                  menuClassName="datepicker-menu border-md"
                  v-model="_orderTime"
                  timePicker
                  selectText="Выбрать"
                  cancelText="Отмена"
                />
              </div>
            </div>
          </div>

          <div class="row items-center">
            <div class="col-2 q-px-sm">
              <q-input
                v-model="_passengerCount"
                type="text"
                borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset"
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Пассажиров"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                :autocomplete="false"
              />
            </div>
            <div class="col-2 q-px-sm">
              <q-input
                v-model="_weight"
                type="text"
                borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset"
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Вес"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                :autocomplete="false"
              />
            </div>
            <div class="col-2 q-px-sm">
              <q-input
                v-model="_length"
                type="text"
                borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset"
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Длина"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                :autocomplete="false"
              />
            </div>
            <div class="col-2 q-px-sm">
              <q-input
                v-model="_width"
                type="text"
                borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset"
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Ширина"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                :autocomplete="false"
              />
            </div>
            <div class="col-2 q-px-sm">
              <q-input
                v-model="_height"
                type="text"
                borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset"
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Высота"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                :autocomplete="false"
              />
            </div>
            <div class="col-2 q-px-sm">
              <q-checkbox v-model="_orderIsEmergency" label="Аварийная" />
            </div>
          </div>
        </div>
      </q-scroll-area>
    </div>
    <q-btn
      text-color="white"
      label="Создать"
      unelevated
      class="border-sm shadow-white col col-shrink"
      color="primary"
      type="submit"
    />
  </q-form>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
import { showNotifyResult } from "src/helpers/notification";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
export default {
  name: "OrderCreation",
  components: {
    Datepicker,
  },
  computed: {
    ...mapState("current", [
      "selectedTransportId",
      "orderIsEmergency",
      "place",
    ]),
    ...mapState("order", [
      "customerPhoneNumber",
      "customerFullname",
      "contactPhoneNumber",
      "contactFullname",
    ]),
    ...mapState("place", ["places"]),
    ...mapGetters("contact", ["getFilteredContacts"]),
    ...mapGetters("customer", ["getFilteredCustomers"]),
    _orderIsEmergency: {
      get() {
        return this.orderIsEmergency;
      },
      set(newVal) {
        this.setOrderIsEmergency(newVal);
      },
    },
    _customerPhoneNumber: {
      get() {
        return this.customerPhoneNumber;
      },
      set(newVal) {
        this.setCustomerPhoneNumber(newVal);
      },
    },
    _contactPhoneNumber: {
      get() {
        return this.contactPhoneNumber;
      },
      set(newVal) {
        this.setContactPhoneNumber(newVal);
      },
    },
  },
  methods: {
    ...mapActions("order", ["addOrder"]),
    ...mapMutations("order", [
      "setCustomerPhoneNumber",
      "setCustomerFullname",
      "setContactPhoneNumber",
      "setContactFullname",

      "clearOrder",
    ]),
    ...mapMutations("current", [
      "setTransport",
      "setSelectedTransportId",
      "setOrderIsEmergency",
      "setPlace",
    ]),

    _setCustomerFullname(val) {
      if (val.fullname) return this.setCustomerFullname(val.fullname);
      this.setCustomerFullname(val);
    },
    _setContactFullname(val) {
      if (val.fullname) return this.setContactFullname(val.fullname);
      this.setContactFullname(val);
    },
    onCustomerSelect(val) {
      this.setCustomerFullname(val.fullname);
      this._customerPhoneNumber = val.phoneNumber;
    },
    onContactSelect(val) {
      this.setContactFullname(val.fullname);
      this._contactPhoneNumber = val.phoneNumber;
    },
    filterFnCustomers(val, update) {
      update(() => {
        if (val.fullname) {
          this.setCustomerFullname(val.fullname);
          this._filterCustomers = val.fullname;
          return;
        }
        this._filterCustomers = val;
      });
    },
    filterFnContacts(val, update) {
      update(() => {
        if (val.fullname)
          if (val.fullname) {
            this.setContactFullname(val.fullname);
            this._filterContacts = val.fullname;
            return;
          }
        this._filterContacts = val;
      });
    },
    async onAddOrder() {
      if (!this.selectedTransportId)
        return showNotifyResult(false, "Выберите транспорт!");
      const d = new Date();
      d.setHours(this._orderTime.hours);
      d.setMinutes(this._orderTime.minutes);
      d.setSeconds(0);
      d.setMilliseconds(0);
      await this.addOrder({
        orderTime: d,
        departurePointId: this._departurePoint.id,
        destinationId: this._destination.id,
        isEmergency: this._orderIsEmergency,
        passengerCount: this._passengerCount,
        weight: this._weight,
        length: this._length,
        width: this._width,
        height: this._height,
        customerPhoneNumber: this.customerPhoneNumber,
        customerFullname: this.customerFullname,
        contactPhoneNumber: this.contactPhoneNumber,
        contactFullname: this.contactFullname,
        transportId: this.selectedTransportId,
        description: this._description,
        name: this._name,
      });
      this.$emit("done");
      this.$refs.form.reset();
    },
    resetForm() {
      this.setSelectedTransportId(null);
      const d = new Date();
      this._orderTime = {
        hours: d.getHours(),
        minutes: d.getMinutes(),
        seconds: 0,
      };
      this._departurePoint = null;
      this._destination = null;
      this._orderIsEmergency = false;
      this._passengerCount = null;
      this._weight = null;
      this._length = null;
      this._width = null;
      this._height = null;
      this._filterCustomers = "";
      this._filterContacts = "";
      this._name = null;
      this._description = null;
      this.setCustomerFullname("");
      this._customerPhoneNumber = "";
      this.setContactFullname("");
      this._contactPhoneNumber = "";
      this.clearOrder();
    },
  },
  mounted() {
    const d = new Date();
    this._orderTime = {
      hours: d.getHours(),
      minutes: d.getMinutes(),
      seconds: 0,
    };
  },
  data() {
    return {
      _orderTime: null,
      _departurePoint: null,
      _destination: null,
      _passengerCount: null,
      _weight: null,
      _length: null,
      _width: null,
      _height: null,
      _filterCustomers: "",
      _filterContacts: "",
      _name: null,
      _description: null,
    };
  },
};
</script>

<style scoped>
/* 
orderTime,
departurePointId,
destinationId,
isEmergency,
passengerCount,
weight,
length,
width,
height,
customerId,
contactId, 
*/
</style>
