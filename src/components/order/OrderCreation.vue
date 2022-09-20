<template>
  <q-form @submit="onAddOrder" @reset="resetForm" class="col column justify-between" ref="form">
    <div class="col row q-mb-md">
      <q-scroll-area class="col">
        <div class="column col q-gutter-y-md">
          <div class="row items-center">
            <div class="col q-px-sm">
              <q-select :model-value="_name" type="text" borderless fill-input hide-selected use-input
                input-debounce="0" :options="getFilteredNames(_filterName)" @filter="filterFnNames"
                @input-value="_setName" class="bg-grey-2 border-sm shadow-white-inset q-px-md" hide-bottom-space
                hide-hint label-color="grey" label="Наименование груза" lazy-rules :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]" autocomplete="off" />
            </div>
          </div>
          <div class="row items-center">
            <div class="col q-px-sm">
              <q-input v-model="_description" type="text" borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset" hide-bottom-space hide-hint label-color="grey"
                label="Комментарий" autocomplete="off" />
            </div>
          </div>

          <div class="row items-stretch">
            <div class="col-4 q-px-sm">
              <q-select class="bg-grey-2 q-px-md border-sm shadow-white-inset" fill-input hide-selected use-input
                input-debounce="0" :options="getFilteredCustomers(_filterCustomers)" @filter="filterFnCustomers"
                @input-value="_setCustomerFullname" :model-value="customerFullname" borderless hide-bottom-space
                hide-hint label-color="grey" label="Ответственный" autocomplete="off" map-options ref="customer">
                <template v-slot:option="{ opt, itemProps, itemEvents }">
                  <q-item v-bind="itemProps" v-on="itemEvents" @click="onCustomerSelect(opt)">
                    <q-item-section>
                      <q-item-label>{{ `${opt.fullname} ( ${opt.subdivision} ) ${opt.phoneNumber}` }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-4 q-px-sm">
              <q-select :model-value="_customerSubdivision" type="text" borderless fill-input hide-selected use-input
                input-debounce="0" :options="getFilteredSubdivisions(_filterSubdivision)" @filter="filterFnSubdivisions"
                @input-value="_setCustomerSubdivision" class="bg-grey-2 border-sm shadow-white-inset q-px-md"
                hide-bottom-space hide-hint label-color="grey" label="Подразделение" lazy-rules :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]" autocomplete="off" />
            </div>
            <div class="col-4 q-px-sm">
              <q-input v-model="_customerPhoneNumber" type="text" borderless
                class="bg-grey-2 border-sm shadow-white-inset q-px-md" hide-bottom-space hide-hint label-color="grey"
                label="Телефон" mask="+7 (###) ### ## ##" lazy-rules :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]" autocomplete="off" />
            </div>
          </div>
          <div class="row items-stretch">
            <div class="col-8 q-px-sm">
              <q-select class="bg-grey-2 border-sm q-px-md shadow-white-inset" fill-input hide-selected use-input
                input-debounce="0" :options="getFilteredContacts(_filterContacts)" @filter="filterFnContacts"
                @input-value="_setContactFullname" :model-value="contactFullname" borderless hide-bottom-space hide-hint
                label-color="grey" label="Контактное лицо" autocomplete="off">
                <template v-slot:option="{ opt, itemProps, itemEvents }">
                  <q-item v-bind="itemProps" v-on="itemEvents" @click="onContactSelect(opt)">
                    <q-item-section>
                      <q-item-label>{{ `${opt.fullname} ${opt.phoneNumber}` }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-4 q-px-sm">
              <q-input v-model="_contactPhoneNumber" type="text" borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset" hide-bottom-space hide-hint label-color="grey"
                label="Телефон" mask="+7 (###) ### ## ##" autocomplete="off" />
            </div>
          </div>
          <div class="row items-stretch">
            <div class="col-5 q-px-sm row">
              <q-select v-model="_departurePointName" type="text" fill-input hide-selected use-input input-debounce="0"
                :options="getFilteredPlaces(_filterDeparturePoints)" @filter="filterFnDeparturePoints"
                @input-value="_setDeparturePointName" :model-value="departurePointName" borderless hide-bottom-space
                hide-hint class="bg-grey-2 border-sm q-px-md shadow-white-inset col" autocomplete="off"
                label="Место отправления">
                <template v-slot:option="{ opt, itemProps, itemEvents }">
                  <q-item v-bind="itemProps" v-on="itemEvents" @click="onDeparturePointSelect(opt)">
                    <q-item-section>
                      <q-item-label>{{ opt.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-btn color="primary" icon="las la-map-marker" flat rounded class="q-ml-sm" :disable="!place"
                    @click.stop="
                      () => {
                        onDeparturePointSelect(place);
                        setPlace(null);
                      }
                    " />
                </template>
              </q-select>
            </div>
            <div class="col-5 q-px-sm">
              <q-select v-model="_destinationName" type="text" fill-input hide-selected use-input input-debounce="0"
                :options="getFilteredPlaces(_filterDestinations)" @filter="filterFnDestinations"
                @input-value="_setDestinatioName" :model-value="destinationName" borderless hide-bottom-space hide-hint
                class="bg-grey-2 border-sm q-px-md shadow-white-inset col" autocomplete="off" label="Место назначения">
                <template v-slot:option="{ opt, itemProps, itemEvents }">
                  <q-item v-bind="itemProps" v-on="itemEvents" @click="onDestinationSelect(opt)">
                    <q-item-section>
                      <q-item-label>{{ opt.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-btn color="primary" icon="las la-map-marker" flat rounded class="q-ml-sm" :disable="!place"
                    @click.stop="
                      () => {
                        onDestinationSelect(place);
                        setPlace(null);
                      }
                    " />
                </template>
              </q-select>
            </div>
            <div class="col-2 q-px-sm row">
              <div class="bg-grey-2 border-sm shadow-white-inset col row items-center justify-center">
                <Datepicker inputClassName="datepicker col" menuClassName="datepicker-menu border-md"
                  v-model="_orderTime" timePicker selectText="Выбрать" cancelText="Отмена" />
              </div>
            </div>
          </div>

          <div class="row items-center">
            <div class="col-2 q-px-sm">
              <q-input v-model="_passengerCount" type="number"
                :min="_weight != 0 && _length != 0 && _width != 0 && _height != 0 ? 0 : 1" borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset" hide-bottom-space hide-hint label-color="grey"
                label="Пассажиров" lazy-rules :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]" autocomplete="off" />
            </div>
            <div class="col-2 q-px-sm">
              <q-input v-model="_weight" type="number" :min="_passengerCount == 0 ? 1 : 0" borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset" hide-bottom-space hide-hint label-color="grey"
                label="Вес" lazy-rules :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]" autocomplete="off" />
            </div>
            <div class="col-2 q-px-sm">
              <q-input v-model="_length" type="number" :min="_passengerCount == 0 ? 1 : 0" borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset" hide-bottom-space hide-hint label-color="grey"
                label="Длина" lazy-rules :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]" autocomplete="off" />
            </div>
            <div class="col-2 q-px-sm">
              <q-input v-model="_width" type="number" :min="_passengerCount == 0 ? 1 : 0" borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset" hide-bottom-space hide-hint label-color="grey"
                label="Ширина" lazy-rules :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]" autocomplete="off" />
            </div>
            <div class="col-2 q-px-sm">
              <q-input v-model="_height" type="number" :min="_passengerCount == 0 ? 1 : 0" borderless
                class="bg-grey-2 border-sm q-px-md shadow-white-inset" hide-bottom-space hide-hint label-color="grey"
                label="Высота" lazy-rules :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]" autocomplete="off" />
            </div>
            <div class="col-2 q-px-sm">
              <q-checkbox v-model="_orderIsEmergency" label="Аварийная" />
            </div>
          </div>
        </div>
      </q-scroll-area>
    </div>
    <q-btn text-color="white" label="Создать" unelevated class="border-sm shadow-white col col-shrink" color="primary"
      type="submit" />
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
      "customerSubdivision",
      "contactPhoneNumber",
      "contactFullname",
      "destinationName",
      "departurePointName",
      "name"
    ]),
    ...mapState("place", ["places"]),
    ...mapGetters("contact", ["getFilteredContacts"]),
    ...mapGetters("customer", ["getFilteredCustomers", "getFilteredSubdivisions"]),
    ...mapGetters('order', ["getFilteredNames"]),
    ...mapGetters("place", ["getFilteredPlaces"]),
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
    _customerSubdivision: {
      get() {
        return this.customerSubdivision;
      },
      set(newVal) {
        this.setCustomerSubdivision(newVal);
      },
    },
    _name: {
      get() {
        return this.name;
      },
      set(newVal) {
        this.setName(newVal);
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
    _departurePointName: {
      get() {
        return this.departurePointName;
      },
      set(newVal) {
        this.setDeparturePointName(newVal);
      },
    },
    _destinationName: {
      get() {
        return this.destinationName;
      },
      set(newVal) {
        this.setDestinationName(newVal);
      },
    },
  },
  methods: {
    ...mapActions("order", ["addOrder"]),
    ...mapMutations("order", [
      "setCustomerPhoneNumber",
      "setCustomerFullname",
      "setCustomerSubdivision",
      "setContactPhoneNumber",
      "setContactFullname",
      "setDeparturePointName",
      "setDestinationName",
      "setName"
    ]),
    ...mapMutations("current", [
      "setTransport",
      "setSelectedTransportId",
      "setOrderIsEmergency",
      "setPlace",
      "clearOrder",
    ]),

    _setCustomerFullname(val) {
      if (val.fullname) return this.setCustomerFullname(val.fullname);
      this.setCustomerFullname(val);
    },
    _setCustomerSubdivision(val) {
      this._customerSubdivision = val;
    },
    _setName(val) {
      this._name = val;
    },
    _setContactFullname(val) {
      if (val.fullname) return this.setContactFullname(val.fullname);
      this.setContactFullname(val);
    },
    _setDestinatioName(val) {
      if (val.name) return this.setDestinationName(val.name);
      this.setDestinationName(val);
    },
    _setDeparturePointName(val) {
      if (val.name) return this.setDeparturePointName(val.name);
      this.setDeparturePointName(val);
    },
    onCustomerSelect(val) {
      this.$refs.customer.reset();
      this.setCustomerFullname(val.fullname);
      this._customerPhoneNumber = val.phoneNumber;
      this._customerSubdivision = val.subdivision;
      this.$refs.customer.blur();
    },
    onContactSelect(val) {
      this.setContactFullname(val.fullname);
      this._contactPhoneNumber = val.phoneNumber;
    },
    onDeparturePointSelect(val) {
      this.setDeparturePointName(val.name);
    },
    onDestinationSelect(val) {
      this.setDestinationName(val.name);
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
    filterFnSubdivisions(val, update) {
      update(() => {
        this._filterSubdivision = val;
      });
    },
    filterFnNames(val, update) {
      update(() => {
        this._filterName = val;
      });
    },
    filterFnDestinations(val, update) {
      update(() => {
        if (val.name) {
          this.setDestinationName(val.name);
          this._filterDestinations = val.name;
          return;
        }
        this._filterDestinations = val;
      });
    },
    filterFnDeparturePoints(val, update) {
      update(() => {
        if (val.name)
          if (val.name) {
            this.setDeparturePointName(val.name);
            this._filterDeparturePoints = val.name;
            return;
          }
        this._filterDeparturePoints = val;
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
        departurePointName: this.departurePointName,
        destinationName: this.destinationName,
        isEmergency: this._orderIsEmergency,
        passengerCount: this._passengerCount,
        weight: this._weight,
        length: this._length,
        width: this._width,
        height: this._height,
        customerPhoneNumber: this.customerPhoneNumber,
        customerFullname: this.customerFullname,
        customerSubdivision: this.customerSubdivision,
        contactPhoneNumber: this.contactPhoneNumber,
        contactFullname: this.contactFullname,
        transportId: this.selectedTransportId,
        description: this._description,
        name: this.name,
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
      this.setDeparturePointName(null);
      this.setDestinationName(null);
      this._orderIsEmergency = false;
      this._passengerCount = null;
      this._weight = null;
      this._length = null;
      this._width = null;
      this._height = null;
      this._filterCustomers = null;
      this._filterSubdivision = null;
      this._filterContacts = null;
      this._filterDeparturePoints = null;
      this._filterDestinations = null;
      this._description = null;
      this.setName(null);
      this.setCustomerFullname(null);
      this.setCustomerPhoneNumber(null);
      this.setCustomerSubdivision(null);
      this.setContactFullname(null);
      this.setContactPhoneNumber(null);
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
      _passengerCount: null,
      _weight: null,
      _length: null,
      _width: null,
      _height: null,
      _filterCustomers: null,
      _filterSubdivision: null,
      _filterName: null,
      _filterContacts: null,
      _filterDeparturePoints: null,
      _filterDestinations: null,
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
