<template>
  <q-form
    @submit="onSubmit"
    @reset="resetForm"
    class="col column justify-between q-pa-md"
    ref="form"
  >
    <div class="col row q-mb-md">
      <q-scroll-area class="col">
        <div class="column col q-gutter-y-md">
          <div class="row items-center">
            <div class="col q-px-sm">
              <ISelect
                :options="names"
                v-model="_name"
                :labelFn="(item) => item.name"
                label="Наименование груза"
                @selected="(val) => (_name = val.name)"
                :required="true"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col q-px-sm">
              <q-input
                v-model="_description"
                type="text"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Комментарий"
                autocomplete="off"
              />
            </div>
          </div>

          <div class="row items-stretch">
            <div class="col-4 q-px-sm">
              <ISelect
                :options="customers"
                v-model="_customerFullname"
                :labelFn="
                  (item) =>
                    `${item.fullname} ( ${item.subdivision} ) ${item.phoneNumber}`
                "
                label="Ответственный"
                @selected="
                  (val) => {
                    _customerFullname = val.fullname;
                    _customerPhoneNumber = val.phoneNumber;
                    _customerSubdivision = val.subdivision;
                    setCustomerSubdivision(val.subdivision);
                  }
                "
                :required="true"
              />
            </div>
            <div class="col-4 q-px-sm">
              <ISelect
                :options="subdivisions"
                v-model="_customerSubdivision"
                :labelFn="(item) => item"
                label="Подразделение"
                @selected="(val) => {
                _customerSubdivision = val; 
                setCustomerSubdivision(val);
                }"
                :required="true"
              />
            </div>
            <div class="col-4 q-px-sm">
              <q-input
                v-model="_customerPhoneNumber"
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
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
              />
            </div>
          </div>

          <div class="row items-stretch">
            <div class="col-5 q-px-sm row">
              <ISelect
                :options="places"
                v-model="_departurePointName"
                :labelFn="(item) => item.name"
                label="Место отправления"
                @selected="(val) => (_departurePointName = val.name)"
                :required="true"
              />
            </div>
            <div class="col-5 q-px-sm">
              <ISelect
                :options="places"
                v-model="_destinationName"
                :labelFn="(item) => item.name"
                label="Место назначения"
                @selected="(val) => (_destinationName = val.name)"
                :required="true"
              />
            </div>
            <div class="col-2 q-px-sm row">
              <div class="col row items-center justify-center">
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
                type="number"
                :min="
                  _weight != 0 && _length != 0 && _width != 0 && _height != 0
                    ? 0
                    : 1
                "
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Пассажиров"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
              />
            </div>
            <div class="col-2 q-px-sm">
              <q-input
                v-model="_weight"
                type="number"
                :min="_passengerCount == 0 ? 1 : 0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Вес"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
              />
            </div>
            <div class="col-2 q-px-sm">
              <q-input
                v-model="_length"
                type="number"
                :min="_passengerCount == 0 ? 1 : 0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Длина"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
              />
            </div>
            <div class="col-2 q-px-sm">
              <q-input
                v-model="_width"
                type="number"
                :min="_passengerCount == 0 ? 1 : 0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Ширина"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
              />
            </div>
            <div class="col-2 q-px-sm">
              <q-input
                v-model="_height"
                type="number"
                :min="_passengerCount == 0 ? 1 : 0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Высота"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
              />
            </div>
            <div class="col-2 q-px-sm column justify-between">
              <q-checkbox
                v-model="_orderIsEmergency"
                label="Аварийная"
                dense
              />
            </div>
          </div>
          <div class="row q-pl-sm">
            <q-checkbox
              v-model="_allowContact"
              label="Контактное лицо"
              dense
              v-if="_passengerCount && _passengerCount >= 1"
            />
          </div>
          <div
            class="row items-stretch"
            v-if="_allowContact && _passengerCount && _passengerCount >= 1"
          >
            <div class="col-8 q-px-sm">
              <ISelect
                :options="contacts"
                v-model="_contactFullname"
                :labelFn="(item) => `${item.fullname} ${item.phoneNumber}`"
                label="Контактное лицо"
                @selected="
                  (val) => {
                    _contactFullname = val.fullname;
                    _contactPhoneNumber = val.phoneNumber;
                  }
                "
              />
            </div>
            <div class="col-4 q-px-sm">
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
            </div>
          </div>
        </div>
      </q-scroll-area>
    </div>
    <div class="row">
      <q-btn
        v-if="!_creationMode && getStatusById(order.statusId).code == 'REQUEST'"
        text-color="white"
        label="Принять и применить изменения"
        unelevated
        class="border-sm shadow-white col q-mr-md"
        color="primary"
        @click="onApprove"
      />
      <q-btn
        v-if="!_creationMode && getStatusById(order.statusId).code == 'REQUEST'"
        text-color="white"
        label="Отклонить"
        unelevated
        class="border-sm shadow-white col col-shrink"
        color="red"
        @click="onDecline"
      />
      <q-btn
        v-if="_creationMode"
        text-color="white"
        label="Создать"
        unelevated
        class="border-sm shadow-white col"
        color="primary"
        type="submit"
      />
      <q-btn
        v-if="!_creationMode && getStatusById(order.statusId).code != 'REQUEST'"
        text-color="white"
        label="Изменить"
        unelevated
        class="border-sm shadow-white col q-mr-md"
        color="primary"
        type="submit"
      />
      <q-btn
        v-if="!_creationMode && getStatusById(order.statusId).code != 'REQUEST'"
        text-color="white"
        label="Удалить"
        unelevated
        class="border-sm shadow-white col col-shrink"
        color="red"
        @click="onRemoveOrder"
      />
      <q-btn
        text-color="white"
        label="Отмена"
        unelevated
        class="border-sm shadow-white col col-shrink q-ml-md"
        color="green"
        @click="onCancel()"
      />
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
import Datepicker from "@vuepic/vue-datepicker";
import ISelect from "components/base/ISelect.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { showNotifyResult } from "src/helpers/notification";
export default {
  name: "OrderCreation",
  components: {
    Datepicker,
    ISelect,
  },
  computed: {
    ...mapState("current", ["selectedTransportId", "orderIsEmergency"]),
    ...mapState("order", ["names"]),
    ...mapState("current", ["order"]),
    ...mapState("place", ["places"]),
    ...mapState("contact", ["contacts"]),
    ...mapGetters("contact", ["getContactById"]),
    ...mapState("customer", ["customers"]),
    ...mapGetters("customer", ["getCustomerById", "subdivisions"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("status", ["getStatusById"]),
    _orderIsEmergency: {
      get() {
        return this.orderIsEmergency;
      },
      set(newVal) {
        this.setOrderIsEmergency(newVal);
      },
    },
  },
  methods: {
    ...mapActions("order", [
      "updateOrder",
      "removeOrder",
      "addOrder",
      "approveOrder",
      "declineOrder",
    ]),
    ...mapMutations("current", [
      "setTransport",
      "setSelectedTransportId",
      "setOrderIsEmergency",
      "clearOrder",
    ]),
    ...mapMutations("order", ['setCustomerSubdivision']),
    onCancel() {
      this.$refs.form.reset();
    },
    async onApprove() {
      if (!this.selectedTransportId)
        return showNotifyResult(false, "Выберите транспорт!");
      const d = new Date();
      d.setHours(this._orderTime.hours);
      d.setMinutes(this._orderTime.minutes);
      d.setSeconds(0);
      d.setMilliseconds(0);
      await this.approveOrder({
        id: this.order.id,
        orderTime: d,
        departurePointName: this._departurePointName,
        destinationName: this._destinationName,
        isEmergency: this._orderIsEmergency,
        passengerCount: Number(this._passengerCount),
        weight: Number(this._weight),
        length: Number(this._length),
        width: Number(this._width),
        height: Number(this._height),
        customerPhoneNumber: this._customerPhoneNumber,
        customerFullname: this._customerFullname,
        customerSubdivision: this._customerSubdivision,
        contactPhoneNumber:
          this._allowContact &&
            this._passengerCount &&
            this._passengerCount >= 1
            ? this._contactPhoneNumber
            : null,
        contactFullname:
          this._allowContact &&
            this._passengerCount &&
            this._passengerCount >= 1
            ? this._contactFullname
            : null,
        transportId: this.selectedTransportId ?? null,
        name: this._name,
        description: this._description,
      });
      this.$refs.form.reset();
    },
    async onDecline() {
      const d = new Date();
      d.setHours(this._orderTime.hours);
      d.setMinutes(this._orderTime.minutes);
      d.setSeconds(0);
      d.setMilliseconds(0);
      await this.declineOrder({
        id: this.order.id,
      });
      this.$refs.form.reset();
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
        departurePointName: this._departurePointName,
        destinationName: this._destinationName,
        isEmergency: this._orderIsEmergency,
        passengerCount: Number(this._passengerCount),
        weight: Number(this._weight),
        length: Number(this._length),
        width: Number(this._width),
        height: Number(this._height),
        customerPhoneNumber: this._customerPhoneNumber,
        customerFullname: this._customerFullname,
        customerSubdivision: this._customerSubdivision,
        contactPhoneNumber:
          this._allowContact &&
            this._passengerCount &&
            this._passengerCount >= 1
            ? this._contactPhoneNumber
            : null,
        contactFullname:
          this._allowContact &&
            this._passengerCount &&
            this._passengerCount >= 1
            ? this._contactFullname
            : null,
        transportId: this.selectedTransportId,
        description: this._description,
        name: this._name,
      });
      this.$refs.form.reset();
    },
    async onUpdateOrder() {
      const d = new Date();
      d.setHours(this._orderTime.hours);
      d.setMinutes(this._orderTime.minutes);
      d.setSeconds(0);
      d.setMilliseconds(0);
      await this.updateOrder({
        id: this.order.id,
        orderTime: d,
        departurePointName: this._departurePointName,
        destinationName: this._destinationName,
        isEmergency: this._orderIsEmergency,
        passengerCount: Number(this._passengerCount),
        weight: Number(this._weight),
        length: Number(this._length),
        width: Number(this._width),
        height: Number(this._height),
        customerPhoneNumber: this._customerPhoneNumber,
        customerFullname: this._customerFullname,
        customerSubdivision: this._customerSubdivision,
        contactPhoneNumber:
          this._allowContact &&
            this._passengerCount &&
            this._passengerCount >= 1
            ? this._contactPhoneNumber
            : null,
        contactFullname:
          this._allowContact &&
            this._passengerCount &&
            this._passengerCount >= 1
            ? this._contactFullname
            : null,
        transportId: this.selectedTransportId ?? null,
        name: this._name,
        description: this._description,
      });
      this.$refs.form.reset();
    },
    async onSubmit() {
      this._creationMode ? await this.onAddOrder() : await this.onUpdateOrder();
    },
    async onRemoveOrder() {
      await this.removeOrder({ id: this.order.id });
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
      this._departurePointName = null;
      this._destinationName = null;
      this._orderIsEmergency = false;
      this._passengerCount = null;
      this._weight = null;
      this._length = null;
      this._width = null;
      this._height = null;
      this._filterCustomers = null;
      this._filterSubdivision = null;
      this._filterContacts = null;
      this._description = null;
      this._allowContact = false;
      this._name = null;
      this._customerPhoneNumber = null;
      this._customerFullname = null;
      this._customerSubdivision = null;
      this._contactFullname = null;
      this._contactPhoneNumber = null;
      this.setCustomerSubdivision(null);
      this.clearOrder();
      this.$emit("done");
    },
    loadData() {
      if (this.order) {
        const d = new Date(this.order.orderTime);
        this._orderTime = {
          hours: d.getHours(),
          minutes: d.getMinutes(),
          seconds: 0,
        };
        this._departurePointName = this.getPlaceById(
          this.order.departurePointId
        ).name;
        this._destinationName = this.getPlaceById(
          this.order.destinationId
        ).name;
        this._orderIsEmergency = this.order.isEmergency;
        this._passengerCount = this.order.passengerCount;
        this._weight = this.order.weight;
        this._length = this.order["length"];
        this._width = this.order.width;
        this._height = this.order.height;
        this._name = this.order.name;
        this._description = this.order.description;
        const contact = this.getContactById(this.order?.contactId);
        this._allowContact =
          !!contact && !!this._passengerCount && this._passengerCount >= 1;
        const customer = this.getCustomerById(this.order.customerId);
        this._customerPhoneNumber = customer.phoneNumber;
        this._customerFullname = customer.fullname;
        this._customerSubdivision = customer.subdivision;
        this._contactFullname = contact?.fullname;
        this._contactPhoneNumber = contact?.phoneNumber;
        this.setSelectedTransportId(this.order.transportId);
        this._creationMode = false;
      } else {
        const d = new Date();
        this._orderTime = {
          hours: d.getHours(),
          minutes: d.getMinutes(),
          seconds: 0,
        };
        this._creationMode = true;
      }
    },
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      _orderTime: null,
      _passengerCount: null,
      _weight: null,
      _length: null,
      _width: null,
      _height: null,
      _filterContacts: null,
      _description: null,
      _allowContact: false,
      _creationMode: true,
      _name: null,
      _customerPhoneNumber: null,
      _customerFullname: null,
      _customerSubdivision: null,
      _departurePointName: null,
      _destinationName: null,
      _contactFullname: null,
      _contactPhoneNumber: null,
    };
  },
  watch: {
    "order.id"() {
      if (this.order) this.loadData();
    },
    order() {
      this._creationMode = !this.order;
    },
  },
};
</script>
