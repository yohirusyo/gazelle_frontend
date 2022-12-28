<template>
  <div class="col column">
    <q-form
      @submit="onSubmit"
      @reset="resetForm"
      class="col column justify-between q-pa-md"
      ref="form"
    >
      <div class="col row">
        <q-scroll-area class="col">
          <div class="column col q-gutter-y-md">
            <div class="row items-center q-mb-md">
              <div
                class="col row items-center justify-center"
                v-if="
                  _creationMode || (!_creationMode && request.order.orderTime)
                "
              >
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
                      {{
                        moment(_selectedDate).lang("ru").format("D MMM, dddd")
                      }}
                    </div>
                  </div>
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="_selectedDate" minimal>
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Закрыть"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-btn>

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
            <ISelect
              :options="places"
              v-model="_departurePointName"
              :labelFn="(item) => item.name"
              label="Место отправления"
              @selected="(val) => (_departurePointName = val.name)"
              :required="true"
            />
            <ISelect
              :options="places"
              v-model="_destinationName"
              :labelFn="(item) => item.name"
              :label="
                'Место назначения' + (combinedOrders.length != 0 ? ' 1' : '')
              "
              @selected="(val) => (_destinationName = val.name)"
              :required="true"
            />

            <q-checkbox
              v-model="withPassengers"
              label="Поедут пассажиры"
              dense
            />

            <q-input
              v-if="withPassengers"
              v-model="passengerCount"
              type="number"
              :min="
                weight != 0 && length != 0 && width != 0 && height != 0 ? 0 : 1
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
            <q-checkbox
              v-if="withPassengers && passengerCount && passengerCount >= 1"
              v-model="allowContact"
              label="Контактное лицо"
              dense
            />

            <div
              v-if="
                withPassengers &&
                allowContact &&
                passengerCount &&
                passengerCount >= 1
              "
            >
              <ISelect
                :options="contacts"
                v-model="contactFullname"
                :labelFn="(item) => `${item.fullname} ${item.phoneNumber}`"
                label="Контактное лицо"
                @selected="
                  (val) => {
                    contactFullname = val.fullname;
                    contactPhoneNumber = val.phoneNumber;
                  }
                "
              />
              <q-input
                v-model="contactPhoneNumber"
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
                class="q-mt-md"
              />
            </div>

            <q-checkbox v-model="withCargo" label="Груз" dense />

            <div class="column items-stretch" v-if="withCargo">
              <div class="row q-gutter-x-md">
                <ISelect
                  :options="names"
                  v-model="name"
                  :labelFn="(item) => item.name"
                  label="Наименование груза"
                  @selected="(val) => (name = val.name)"
                  :required="true"
                  class="q-mb-md"
                />
                <q-input
                  v-model="weight"
                  type="number"
                  :min="passengerCount == 0 ? 1 : 0"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  hide-hint
                  label-color="grey"
                  label="Вес (кг)"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') || 'Обязательное поле!',
                  ]"
                  autocomplete="off"
                  class="col"
                />
                <q-input
                  v-model="length"
                  type="number"
                  :min="passengerCount == 0 ? 1 : 0"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  hide-hint
                  label-color="grey"
                  label="Длина (мм)"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') || 'Обязательное поле!',
                  ]"
                  autocomplete="off"
                  class="col"
                />
              </div>
              <div class="row q-mt-md q-gutter-x-md">
                <q-input
                  v-model="width"
                  type="number"
                  :min="passengerCount == 0 ? 1 : 0"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  hide-hint
                  label-color="grey"
                  label="Ширина (мм)"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') || 'Обязательное поле!',
                  ]"
                  autocomplete="off"
                  class="col"
                />
                <q-input
                  v-model="height"
                  type="number"
                  :min="passengerCount == 0 ? 1 : 0"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  hide-hint
                  label-color="grey"
                  label="Высота (мм)"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') || 'Обязательное поле!',
                  ]"
                  autocomplete="off"
                  class="col"
                />
              </div>
            </div>
            <div
              class="column q-gutter-y-md"
              v-for="(combinedOrder, index) of combinedOrders"
              :key="index"
            >
              <div class="row">
                <ISelect
                  :options="places"
                  v-model="combinedOrder.place"
                  :labelFn="(item) => item.name"
                  :label="`Место назначения ${index + 2}`"
                  @selected="(val) => (combinedOrder.place = val.name)"
                  :required="true"
                  class="col"
                />
                <q-btn
                  class="q-ml-sm"
                  text-color="red"
                  unelevated
                  icon="close"
                  flat
                  @click="onRemoveCombinedOrder(index)"
                />
              </div>

              <q-checkbox
                v-model="combinedOrder.withPassengers"
                label="Поедут пассажиры"
                dense
              />

              <q-input
                v-if="combinedOrder.withPassengers"
                v-model="combinedOrder.passengerCount"
                type="number"
                :min="
                  combinedOrder.weight != 0 &&
                  combinedOrder.length != 0 &&
                  combinedOrder.width != 0 &&
                  combinedOrder.height != 0
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
              <q-checkbox
                v-if="
                  combinedOrder.withPassengers &&
                  combinedOrder.passengerCount &&
                  combinedOrder.passengerCount >= 1
                "
                v-model="combinedOrder.allowContact"
                label="Контактное лицо"
                dense
              />

              <div
                v-if="
                  combinedOrder.withPassengers &&
                  combinedOrder.allowContact &&
                  combinedOrder.passengerCount &&
                  combinedOrder.passengerCount >= 1
                "
              >
                <ISelect
                  :options="contacts"
                  v-model="combinedOrder.contactFullname"
                  :labelFn="(item) => `${item.fullname} ${item.phoneNumber}`"
                  label="Контактное лицо"
                  @selected="
                    (val) => {
                      combinedOrder.contactFullname = val.fullname;
                      combinedOrder.contactPhoneNumber = val.phoneNumber;
                    }
                  "
                />
                <q-input
                  v-model="combinedOrder.contactPhoneNumber"
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
                  class="q-mt-md"
                />
              </div>

              <q-checkbox
                v-model="combinedOrder.withCargo"
                label="Груз"
                dense
              />

              <div class="column items-stretch" v-if="combinedOrder.withCargo">
                <div class="row q-gutter-x-md">
                  <ISelect
                    :options="names"
                    v-model="combinedOrder.name"
                    :labelFn="(item) => item.name"
                    label="Наименование груза"
                    @selected="(val) => (combinedOrder.name = val.name)"
                    :required="true"
                    class="q-mb-md"
                  />
                  <q-input
                    v-model="combinedOrder.weight"
                    type="number"
                    :min="combinedOrder.passengerCount == 0 ? 1 : 0"
                    square
                    outlined
                    dense
                    hide-bottom-space
                    hide-hint
                    label-color="grey"
                    label="Вес (кг)"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') || 'Обязательное поле!',
                    ]"
                    autocomplete="off"
                    class="col"
                  />
                  <q-input
                    v-model="combinedOrder.length"
                    type="number"
                    :min="combinedOrder.passengerCount == 0 ? 1 : 0"
                    square
                    outlined
                    dense
                    hide-bottom-space
                    hide-hint
                    label-color="grey"
                    label="Длина (мм)"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') || 'Обязательное поле!',
                    ]"
                    autocomplete="off"
                    class="col"
                  />
                </div>
                <div class="row q-mt-md q-gutter-x-md">
                  <q-input
                    v-model="combinedOrder.width"
                    type="number"
                    :min="combinedOrder.passengerCount == 0 ? 1 : 0"
                    square
                    outlined
                    dense
                    hide-bottom-space
                    hide-hint
                    label-color="grey"
                    label="Ширина (мм)"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') || 'Обязательное поле!',
                    ]"
                    autocomplete="off"
                    class="col"
                  />
                  <q-input
                    v-model="combinedOrder.height"
                    type="number"
                    :min="combinedOrder.passengerCount == 0 ? 1 : 0"
                    square
                    outlined
                    dense
                    hide-bottom-space
                    hide-hint
                    label-color="grey"
                    label="Высота (мм)"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') || 'Обязательное поле!',
                    ]"
                    autocomplete="off"
                    class="col"
                  />
                </div>
              </div>
            </div>
            <div class="row justify-center">
              <q-btn
                text-color="white"
                label="Добавить место назначения"
                unelevated
                class="border-none bg-blue-4"
                color="primary"
                @click="onAddCombinedOrder"
                dense
              />
            </div>
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
            <q-checkbox
              v-model="_orderIsEmergency"
              label="Аварийная"
              dense
              class="q-mb-md"
            />
          </div>
        </q-scroll-area>
      </div>
      <div class="row col col-shrink q-gutter-x-md">
        <q-btn
          text-color="white"
          :label="_creationMode ? 'Создать' : 'Изменить'"
          unelevated
          class="border-none bg-blue-4 col"
          type="submit"
          no-caps
          dense
          :loading="_addLoading"
          :disable="_addLoading"
        />
        <q-btn
          v-if="!_creationMode"
          text-color="white"
          label="Удалить"
          unelevated
          class="border-none bg-red col"
          @click="onRemoveOrder"
          no-caps
          dense
        />
        <q-btn
          text-color="white"
          label="Отмена"
          unelevated
          class="border-none bg-red col"
          @click="onCancel()"
          no-caps
          dense
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
import Datepicker from "@vuepic/vue-datepicker";
import ISelect from "components/base/ISelect.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { showNotifyResult } from "src/helpers/notification";
import * as moment from "moment";
export default {
  name: "OrderRequestCreation",
  props: ["height"],
  components: {
    Datepicker,
    ISelect,
  },
  computed: {
    ...mapState("current", ["orderIsEmergency", "request"]),
    ...mapState("order", ["names"]),
    ...mapState("place", ["places"]),
    ...mapState("contact", ["contacts"]),
    ...mapGetters("contact", ["getContactById"]),
    ...mapState("customer", ["customers"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("orderHistory", ["getRequestById"]),
    _orderIsEmergency: {
      get() {
        return this.orderIsEmergency;
      },
      set(newVal) {
        this.setOrderIsEmergency(newVal);
      },
    },
    withPassengers: {
      get() {
        return this._withPassengers;
      },
      set(val) {
        for (const combinedOrder of this.combinedOrders) {
          combinedOrder.withPassengers = val;
        }
        this._withPassengers = val;
      },
    },
    withCargo: {
      get() {
        return this._withCargo;
      },
      set(val) {
        for (const combinedOrder of this.combinedOrders) {
          combinedOrder.withCargo = val;
        }
        this._withCargo = val;
      },
    },
    passengerCount: {
      get() {
        return this._passengerCount;
      },
      set(val) {
        for (const combinedOrder of this.combinedOrders) {
          combinedOrder.passengerCount = val;
        }
        this._passengerCount = val;
      },
    },
    allowContact: {
      get() {
        return this._allowContact;
      },
      set(val) {
        for (const combinedOrder of this.combinedOrders) {
          combinedOrder.allowContact = val;
        }
        this._allowContact = val;
      },
    },
    contactFullname: {
      get() {
        return this._contactFullname;
      },
      set(val) {
        for (const combinedOrder of this.combinedOrders) {
          combinedOrder.contactFullname = val;
        }
        this._contactFullname = val;
      },
    },
    contactPhoneNumber: {
      get() {
        return this._contactPhoneNumber;
      },
      set(val) {
        for (const combinedOrder of this.combinedOrders) {
          combinedOrder.contactPhoneNumber = val;
        }
        this._contactPhoneNumber = val;
      },
    },
    length: {
      get() {
        return this._length;
      },
      set(val) {
        for (const combinedOrder of this.combinedOrders) {
          combinedOrder.length = val;
        }
        this._length = val;
      },
    },
    width: {
      get() {
        return this._width;
      },
      set(val) {
        for (const combinedOrder of this.combinedOrders) {
          combinedOrder.width = val;
        }
        this._width = val;
      },
    },
    height: {
      get() {
        return this._height;
      },
      set(val) {
        for (const combinedOrder of this.combinedOrders) {
          combinedOrder.height = val;
        }
        this._height = val;
      },
    },
    weight: {
      get() {
        return this._weight;
      },
      set(val) {
        for (const combinedOrder of this.combinedOrders) {
          combinedOrder.weight = val;
        }
        this._weight = val;
      },
    },
    name: {
      get() {
        return this._name;
      },
      set(val) {
        for (const combinedOrder of this.combinedOrders) {
          combinedOrder.name = val;
        }
        this._name = val;
      },
    },
  },
  methods: {
    moment,
    ...mapActions("order", ["addOrderRequest", "updateOrder", "removeOrder"]),
    ...mapMutations("current", ["setOrderIsEmergency", "clearOrder"]),
    ...mapMutations("current", ["setRequest"]),
    onCancel() {
      this.$refs.form.reset();
      this.setRequest(null);
    },
    async onAddOrder() {
      if (!this._withPassengers && !this._withCargo)
        return showNotifyResult(false, "Добавьте груз или пассажиров!");
      this._addLoading = true;
      const d = new Date(this._selectedDate);
      d.setHours(this._orderTime.hours);
      d.setMinutes(this._orderTime.minutes);
      d.setSeconds(0);
      d.setMilliseconds(0);

      const mainForm = {
        isEmergency: this._orderIsEmergency,
        passengerCount: this._withPassengers ? Number(this._passengerCount) : 0,
        weight: this._withCargo ? Number(this._weight) : 0,
        length: this._withCargo ? Number(this._length) : 0,
        width: this._withCargo ? Number(this._width) : 0,
        height: this._withCargo ? Number(this._height) : 0,
        // customerPhoneNumber: this._customerPhoneNumber,
        // customerFullname: this._customerFullname,
        // customerSubdivision: this._customerSubdivision,
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
        name: this.withCargo ? this._name : "Пассажиры",
        isParent: this.combinedOrders.length != 0,
      };

      const parent = await this.addOrderRequest({
        ...mainForm,
        orderTime: d,
        departurePointName: this._departurePointName,
        destinationName: this._destinationName,
      });
      if (this.combinedOrders.length != 0) {
        await this.addOrderRequest({
          ...mainForm,
          orderTime: null,
          departurePointName: this._destinationName,
          destinationName: this.combinedOrders[0].place,
          passengerCount: this.combinedOrders[0].withPassengers
            ? Number(this.combinedOrders[0].passengerCount)
            : 0,
          weight: this.combinedOrders[0].withCargo
            ? Number(this.combinedOrders[0].weight)
            : 0,
          length: this.combinedOrders[0].withCargo
            ? Number(this.combinedOrders[0].length)
            : 0,
          width: this.combinedOrders[0].withCargo
            ? Number(this.combinedOrders[0].width)
            : 0,
          height: this.combinedOrders[0].withCargo
            ? Number(this.combinedOrders[0].height)
            : 0,
          contactPhoneNumber:
            this.combinedOrders[0].allowContact &&
            this.combinedOrders[0].passengerCount &&
            this.combinedOrders[0].passengerCount >= 1
              ? this.combinedOrders[0].contactPhoneNumber
              : null,
          contactFullname:
            this.combinedOrders[0].allowContact &&
            this.combinedOrders[0].passengerCount &&
            this.combinedOrders[0].passengerCount >= 1
              ? this.combinedOrders[0].contactFullname
              : null,
          name: this.combinedOrders[0].withCargo
            ? this.combinedOrders[0].name
            : "Пассажиры",
          parentOrder: parent.id,
        });
        for (let i = 1; i < this.combinedOrders.length; i++) {
          await this.addOrderRequest({
            ...mainForm,
            orderTime: null,
            departurePointName: this.combinedOrders[i - 1].place,
            destinationName: this.combinedOrders[i].place,
            passengerCount: this.combinedOrders[i].withPassengers
              ? Number(this.combinedOrders[i].passengerCount)
              : 0,
            weight: this.combinedOrders[i].withCargo
              ? Number(this.combinedOrders[i].weight)
              : 0,
            length: this.combinedOrders[i].withCargo
              ? Number(this.combinedOrders[i].length)
              : 0,
            width: this.combinedOrders[i].withCargo
              ? Number(this.combinedOrders[i].width)
              : 0,
            height: this.combinedOrders[i].withCargo
              ? Number(this.combinedOrders[i].height)
              : 0,
            contactPhoneNumber:
              this.combinedOrders[i].allowContact &&
              this.combinedOrders[i].passengerCount &&
              this.combinedOrders[i].passengerCount >= 1
                ? this.combinedOrders[i].contactPhoneNumber
                : null,
            contactFullname:
              this.combinedOrders[i].allowContact &&
              this.combinedOrders[i].passengerCount &&
              this.combinedOrders[i].passengerCount >= 1
                ? this.combinedOrders[i].contactFullname
                : null,
            name: this.combinedOrders[i].withCargo
              ? this.combinedOrders[i].name
              : "Пассажиры",
            parentOrder: parent.id,
          });
        }
      }
      this._addLoading = false;
      this.$refs.form.reset();
    },
    async onUpdateOrder() {
      if (!this._withPassengers && !this._withCargo)
        return showNotifyResult(false, "Добавьте груз или пассажиров!");
      const d = new Date(this._selectedDate);
      d.setHours(this._orderTime.hours);
      d.setMinutes(this._orderTime.minutes);
      d.setSeconds(0);
      d.setMilliseconds(0);
      await this.updateOrder({
        id: this.request.orderId,
        isEmergency: this._orderIsEmergency,
        passengerCount: this._withPassengers ? Number(this._passengerCount) : 0,
        weight: this._withCargo ? Number(this._weight) : 0,
        length: this._withCargo ? Number(this._length) : 0,
        width: this._withCargo ? Number(this._width) : 0,
        height: this._withCargo ? Number(this._height) : 0,
        // customerPhoneNumber: this._customerPhoneNumber,
        // customerFullname: this._customerFullname,
        // customerSubdivision: this._customerSubdivision,
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
        name: this.withCargo ? this._name : "Пассажиры",
        orderTime: this.request.order.orderTime ? d : null,
        departurePointName: this._departurePointName,
        destinationName: this._destinationName,
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
    async onRemoveOrder() {
      await this.removeOrder({ id: this.request.orderId });
      this.$refs.form.reset();
    },
    resetForm() {
      this._selectedDate = new Date();
      this._orderTime = {
        hours: this._selectedDate.getHours(),
        minutes: this._selectedDate.getMinutes(),
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
      this._contactFullname = null;
      this._contactPhoneNumber = null;
      this.combinedOrders = [];
      this._withPassengers = false;
      this._withCargo = false;
      this.setRequest(null);
      this.$emit("done");
    },
    onAddCombinedOrder() {
      this.combinedOrders.push({
        ...this.getLastCombinedOrder(),
        place: null,
      });
    },
    onRemoveCombinedOrder(index) {
      this.combinedOrders.splice(index, 1);
    },
    getLastCombinedOrder() {
      if (this.combinedOrders.length != 0)
        return this.combinedOrders[this.combinedOrders.length - 1];
      return {
        withCargo: this._withCargo,
        withPassengers: this._withPassengers,
        passengerCount: this._passengerCount,
        allowContact: this._allowContact,
        contactPhoneNumber: this._contactPhoneNumber,
        contactFullname: this._contactFullname,
        weight: this._weight,
        length: this._length,
        width: this._width,
        height: this._height,
        name: this._name,
      };
    },
    loadData() {
      if (this.request) {
        this._selectedDate = new Date(this.request.order.orderTime);
        this._orderTime = {
          hours: this._selectedDate.getHours(),
          minutes: this._selectedDate.getMinutes(),
          seconds: 0,
        };
        this._departurePointName = this.getPlaceById(
          this.request.order.departurePointId
        ).name;
        this._destinationName = this.getPlaceById(
          this.request.order.destinationId
        ).name;
        this._orderIsEmergency = this.request.order.isEmergency;
        this._passengerCount = this.request.order.passengerCount;
        this._weight = this.request.order.weight;
        this._length = this.request.order["length"];
        this._width = this.request.order.width;
        this._height = this.request.order.height;
        this._name = this.request.order.name;
        this._description = this.request.order.description;
        const contact = this.getContactById(this.request.order?.contactId);
        this._allowContact =
          !!contact && !!this._passengerCount && this._passengerCount >= 1;

        this._contactFullname = contact?.fullname;
        this._contactPhoneNumber = contact?.phoneNumber;
        this._withPassengers =
          this.request.order.passengerCount >= 1 ? true : false;
        this._withCargo =
          this.request.order.width > 0 ||
          this.request.order.height > 0 ||
          this.request.order.weight > 0 ||
          this.request.order.length > 0
            ? true
            : false;
        this._creationMode = false;
      } else {
        this._selectedDate = new Date();
        this._orderTime = {
          hours: this._selectedDate.getHours(),
          minutes: this._selectedDate.getMinutes(),
          seconds: 0,
        };
        this._creationMode = true;
      }
    },
  },
  mounted() {
    this.$refs.form.reset();
    if (this.$route.params.id) {
      const r = this.getRequestById(this.$route.params.id);
      this.setRequest(r);
      this.loadData();
      this._creationMode = false;
    }
  },
  watch: {
    "request.orderId"() {
      if (this.request) this.loadData();
    },
    request() {
      this._creationMode = !this.request;
    },
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
      _name: null,
      _departurePointName: null,
      _destinationName: null,
      _contactFullname: null,
      _contactPhoneNumber: null,
      _selectedDate: null,
      combinedOrders: [],
      _withPassengers: false,
      _withCargo: false,
      _creationMode: true,
      _addLoading: false,
    };
  },
};
</script>
