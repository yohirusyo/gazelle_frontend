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
            <OrderCustomerISelect
              v-if="!isCustomer"
              :phoneNumber="customer.phoneNumber"
              :fullname="customer.fullname"
              :subdivision="customer.subdivision"
              @update:phoneNumber="(val) => (customer.phoneNumber = val)"
              @update:fullname="(val) => (customer.fullname = val)"
              @update:subdivision="(val) => (customer.subdivision = val)"
            />

            <OrderPlaceISelect
              v-model="departurePointName"
              label="Место отправления"
            />

            <OrderPoints v-model="points" :isEditMode="!!selected" />

            <OrderDescription v-model="description" />

            <div class="row justify-center items-center q-gutter-x-md">
              <OrderTime v-model="orderTime" />
            </div>

            <!-- <q-select
              v-if="$q.screen.xs"
              v-model="_transport"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Выберите транспорт"
              :options="getByOnlyFreeFilter(false, true, [])"
              :option-label="(item) => `${item.transportNumber} ${item.type}`"
              :option-value="(item) => item.id"
              clearable
              autocomplete="off"
              class="col-2"
            /> -->
            <q-checkbox
              v-model="_orderIsEmergency"
              label="Аварийная"
              dense
              class="q-mb-md"
            />
          </div>
        </q-scroll-area>
      </div>
      <div class="col col-shrink q-gutter-y-sm column">
        <div
          class="col row q-gutter-x-sm items-center"
          v-if="_approvementMenuActive"
        >
          <q-btn
            text-color="white"
            label="Принять"
            unelevated
            class="border-none bg-blue-4 col"
            color="primary"
            @click="onApprove"
            no-caps
            dense
          />

          <q-btn
            text-color="white"
            label="Отклонить"
            unelevated
            class="border-none bg-red col"
            @click="onDecline"
            no-caps
            dense
          />
        </div>

        <div class="col row q-gutter-x-sm items-center">
          <q-btn
            v-if="_creationMode"
            text-color="white"
            label="Создать"
            unelevated
            class="border-none bg-blue-4 col"
            type="submit"
            no-caps
            dense
            :loading="_addLoading"
            :disable="_addLoading"
          />
          <q-btn
            v-if="_editMenuActive"
            text-color="white"
            label="Изменить"
            unelevated
            class="border-none bg-blue-4 col"
            type="submit"
            no-caps
            dense
          />

          <q-btn
            v-if="_removeMenuActive"
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
            class="border-none bg-green col"
            @click="onCancel()"
            no-caps
            dense
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";

import ISelect from "components/base/ISelect.vue";
import { showNotifyResult } from "src/helpers/notification";
import * as moment from "moment";
import OrderCustomerISelect from "./OrderForm/OrderCustomerISelect.vue";
import OrderPlaceISelect from "./OrderForm/OrderPlaceISelect.vue";
import OrderPoints from "./OrderForm/OrderPoints.vue";
import OrderDescription from "./OrderForm/OrderDescription.vue";
import OrderTime from "./OrderForm/OrderTime.vue";
export default {
  name: "OrderCreation",
  props: ["selected", "isCustomer"],
  components: {
    ISelect,
    OrderCustomerISelect,
    OrderPlaceISelect,
    OrderPoints,
    OrderDescription,
    OrderTime,
  },
  computed: {
    ...mapState("current", [
      "selectedTransportId",
      "orderIsEmergency",
      "currentUser",
    ]),
    // ...mapGetters("transport", ["getByOnlyFreeFilter", "getTransportById"]),
    ...mapGetters("order", ["orderRoute"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapGetters("contact", ["getContactById"]),
    ...mapGetters("orderHistory", ["getRequestById"]),
    _orderIsEmergency: {
      get() {
        return this.orderIsEmergency;
      },
      set(newVal) {
        this.setOrderIsEmergency(newVal);
      },
    },
    _approvementMenuActive: {
      get() {
        return (
          !this._creationMode &&
          this.selected &&
          this.selected.isRequest &&
          !this.selected.isApproved &&
          !this.selected.isDeclined &&
          !this.isCustomer
        );
      },
    },
    _editMenuActive: {
      get() {
        if (this.isCustomer) {
          return (
            !this._creationMode &&
            this.selected &&
            this.selected.isRequest &&
            !this.selected.isDeclined &&
            !this.selected.isDone
          );
        } else {
          return (
            !this._creationMode &&
            this.selected &&
            ((this.selected.isRequest &&
              this.selected.isApproved &&
              !this.selected.isDeclined) ||
              !this.selected.isRequest)
          );
        }
      },
    },
    _removeMenuActive: {
      get() {
        if (this.isCustomer) return false;
        return (
          !this._creationMode &&
          this.selected &&
          ((this.selected.isRequest &&
            this.selected.isApproved &&
            !this.selected.isDeclined) ||
            !this.selected.isRequest)
        );
      },
    },
    // _transport: {
    //   get() {
    //     return this.getTransportById(this.selectedTransportId);
    //   },
    //   set(val) {
    //     this.setSelectedTransportId(val?.id);
    //   },
    // },
  },
  methods: {
    ...mapActions("order", ["updateRoute", "removeRoute", "addRoute"]),
    ...mapMutations("current", [
      "setSelectedTransportId",
      "setOrderIsEmergency",
    ]),
    ...mapMutations("current", ["setSelectedTransportId"]),
    ...mapMutations("order", ["setCustomerSubdivision"]),
    checkAlerts() {
      if (!this.selectedTransportId && !this.isCustomer) {
        showNotifyResult(false, "Выберите транспорт!");
        return true;
      }
      if (this.points.length == 0) {
        showNotifyResult(
          false,
          "Необходимо выбрать хотя бы 1 точку назначения!"
        );
        return true;
      }
      const emptyPoint = this.points.some(
        (p) => !p.cargo.withCargo && !p.passenger.withPassengers && !p.forDelete
      );
      if (emptyPoint) {
        showNotifyResult(false, "Добавьте груз или пассажиров!");
        return true;
      }
      return false;
    },
    onCancel() {
      this.resetForm();
    },
    buildRoute() {
      return {
        orderTime: this.orderTime,
        departurePointName: this.departurePointName,
        isEmergency: this._orderIsEmergency,
        transportId: this.selectedTransportId,
        customerPhoneNumber: this.customer.phoneNumber,
        customerFullname: this.customer.fullname,
        customerSubdivision: this.customer.subdivision,
        description: this.description,
        elements: this.points.map(this.buildPoint),
        isRequest: this.selected?.isRequest,
        isApproved: this.selected?.isApproved,
        isDeclined: this.selected?.isDeclined,
      };
    },
    buildPoint(point) {
      return {
        destinationName: point.destinationName,
        passengerCount: point.passenger.passengerCount ?? 0,
        weight: point.cargo.weight ?? 0,
        width: point.cargo.width ?? 0,
        length: point.cargo.length ?? 0,
        height: point.cargo.height ?? 0,
        contactPhoneNumber:
          !!point.passenger.contact.phoneNumber &&
          point.passenger.contact.phoneNumber.trim() != "" &&
          !!point.passenger.contact.fullname &&
          point.passenger.contact.fullname.trim() != ""
            ? point.passenger.contact.phoneNumber
            : null,
        contactFullname:
          !!point.passenger.contact.phoneNumber &&
          point.passenger.contact.phoneNumber.trim() != "" &&
          !!point.passenger.contact.fullname &&
          point.passenger.contact.fullname.trim() != ""
            ? point.passenger.contact.fullname
            : null,
        name: point.cargo.withCargo ? point.cargo.name : "Пассажиры", // TODO Пассажиры
        isNew: point.isNew,
        existingId: point.existingId,
        forDelete: point.forDelete,
      };
    },
    async onApprove() {
      //
      if (this.checkAlerts()) return;
      await this.updateRoute({
        id: this.selected.id,
        ...this.buildRoute(),
        isApproved: true,
        isDeclined: false,
      });
      this.$refs.form.reset();
    },
    async onDecline() {
      //
      await this.updateRoute({
        id: this.selected.id,
        ...this.buildRoute(),
        isApproved: false,
        isDeclined: true,
      });
      this.$refs.form.reset();
    },
    async onAddOrder() {
      //
      if (this.checkAlerts()) return;
      this._addLoading = true;
      await this.addRoute({
        ...this.buildRoute(),
        isRequest: !!this.isCustomer,
      });
      this._addLoading = false;
      this.$refs.form.reset();
    },
    async onUpdateOrder() {
      //
      if (this.checkAlerts()) return;
      await this.updateRoute({
        id: this.selected.id,
        ...this.buildRoute(),
      });
      this.$refs.form.reset();
    },
    async onSubmit() {
      this._creationMode ? await this.onAddOrder() : await this.onUpdateOrder();
    },
    async onRemoveOrder() {
      await this.removeRoute({ id: this.selected.id });
      this.$refs.form.reset();
    },
    resetForm() {
      this.setSelectedTransportId(null);
      this._orderIsEmergency = false;
      if (this.isCustomer) {
        this.customer = {
          fullname: this.currentUser.fullname,
          subdivision: this.currentUser.subdivision,
          phoneNumber: this.currentUser.phoneNumber,
        };
      } else {
        this.customer = {
          fullname: null,
          subdivision: null,
          phoneNumber: null,
        };
      }
      this.departurePointName = null;
      this.orderTime = new Date();
      this.description = null;
      this.points = [];
      this.$emit("done");
    },
    loadData() {
      if (this.selected) {
        const order = this.selected.orders[0];

        this._orderIsEmergency = this.selected.isEmergency;

        this.orderTime = new Date(order.orderTime);

        this.departurePointName = this.getPlaceById(
          order.departurePointId
        ).name;

        const { fullname, phoneNumber, subdivision } = this.getCustomerById(
          order.customerId
        );
        this.customer.fullname = fullname;
        this.customer.phoneNumber = phoneNumber;
        this.customer.subdivision = subdivision;
        this.setCustomerSubdivision(subdivision);

        this.description = order.description;

        this.setSelectedTransportId(order.transportId);

        this.points = this.selected.orders.map((o) => {
          const contact = this.getContactById(o.contactId);
          return {
            id: o.priority,
            isNew: false,
            destinationName: this.getPlaceById(o.destinationId).name,
            passenger: {
              withPassengers: o.passengerCount != 0,
              passengerCount: o.passengerCount,
              contact: {
                fullname:
                  !!o.contactId && contact.fullname ? contact.fullname : null,
                phoneNumber:
                  !!o.contactId && contact.phoneNumber
                    ? contact.phoneNumber
                    : null,
              },
            },
            cargo: {
              withCargo:
                o.width != 0 || o.length != 0 || o.weight != 0 || o.height != 0,
              name: o.name,
              width: o.width,
              length: o.length,
              height: o.height,
              weight: o.weight,
            },
            existingId: o.id,
          };
        });
        this._creationMode = false;
      } else {
        if (this.isCustomer) {
          this.customer = {
            fullname: this.currentUser.fullname,
            subdivision: this.currentUser.subdivision,
            phoneNumber: this.currentUser.phoneNumber,
          };
        } else {
          this.customer = {
            fullname: null,
            subdivision: null,
            phoneNumber: null,
          };
        }
        this.setCustomerSubdivision(this.customer.subdivision);
        this.orderTime = new Date();
        this._creationMode = true;
      }
    },
    moment,
  },
  mounted() {
    if (this.$route.params.id) {
      const route = this.getRequestById(this.$route.params.id);
      this.$emit("routeSelected", route);
    }
    this.loadData();
  },
  data() {
    return {
      customer: { fullname: null, subdivision: null, phoneNumber: null },
      departurePointName: null,
      orderTime: new Date(),
      description: null,
      points: [],
      _creationMode: false,
    };
  },
  watch: {
    selected: {
      handler(newVal, oldVal) {
        this._creationMode = !newVal;
        if (newVal != oldVal) this.loadData();
      },
    },
    "customer.subdivision": {
      handler(newVal, oldVal) {
        if (newVal != oldVal) this.setCustomerSubdivision(newVal);
      },
    },
  },
};
</script>
