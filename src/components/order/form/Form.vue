<template v-slot:body="props">
  <div class="col column">
    <q-form @submit="onSubmit" @reset="resetForm" class="col column justify-between"
      :class="$q.screen.xs ? 'q-pl-xs q-py-xs' : 'q-pa-md'" ref="form">
      <div v-if="selected" class="text-center">
        Номер маршрута {{ selected.id }}
      </div>
      <div class="col row">
        <q-scroll-area class="col" :visible="$q.screen.xs" :class="$q.screen.xs ? 'q-pr-lg' : ''">
          <div class="column col q-gutter-y-md">
            <CustomerSelect v-if="!isCustomer" :phoneNumber="customer.phoneNumber" :fullname="customer.fullname"
              :subdivision="customer.subdivision" :mvz="customer.mvz"
              @update:phoneNumber="(val) => (customer.phoneNumber = val)"
              @update:fullname="(val) => (customer.fullname = val)"
              @update:subdivision="(val) => (customer.subdivision = val)" @update:mvz="(val) => (customer.mvz = val)" />

            <PlaceSelect v-model="departurePointName" label="Место отправления" />

            <PointsConstructor v-model="points" :copyMode="copyMode" :isEditMode="!!selected && !copyMode" />

            <DescriptionField v-model="description" :emergensy="_orderIsEmergency" />

            <RemoveReasonField v-if="!isCustomer && _removeMenuActive && !_creationMode" v-model="removeReason"
              :removeReason="_removeMenuActive" />

            <RemoveReasonField v-if="_approvementMenuActive && !copyMode && !_creationMode" v-model="declineReason"
              :removeReason="_approvementMenuActive" />

            <OrderTimePicker v-model="orderTime" class="q-mb-md" :selected="selected" :isCustomer="isCustomer" />

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
            /> мать micro-atx 244*244 --> 
            <q-checkbox v-model="_orderIsEmergency" label="Аварийная (укажите причину аварийности в комментарии)" dense
              class="q-mb-md" v-if="!_isMetiz || _orderCanBeEmergency" />
          </div>
        </q-scroll-area>
      </div>
      <div class="col col-shrink q-gutter-y-sm column">
        <div class="col row q-gutter-x-sm items-center" v-if="_approvementMenuActive && !isCustomer">
          <q-btn text-color="white" label="Принять" unelevated class="border-none bg-blue-4 col" color="primary"
            @click="onApprove" no-caps dense />

          <q-btn :disable="!declineReason" text-color="white" label="Отклонить" unelevated
            class="border-none bg-red col" @click="onDecline" no-caps dense>
            <q-tooltip v-if="!declineReason" anchor="top middle">Укажите причину отклонения</q-tooltip>
          </q-btn>
        </div>

        <div class="col row q-gutter-x-sm items-center" v-if="!_creationMode &&
          selected &&
          selected.isRequest &&
          selected.isApproved &&
          !isCustomer &&
          !currentUser?.role.includes('WATCHER')
        ">
          <q-btn text-color="white" label="Вернуть в запрос" unelevated class="border-none bg-grey col" color="primary"
            @click="onBackToRequest" no-caps dense />
        </div>

        <div class="col row q-gutter-x-sm items-center">
          <q-btn v-if="_creationMode || copyMode" text-color="white" :label="_customerCreationCheck
            ? 'У вас израсходован лимит поездок!'
            : 'Создать'
            " unelevated class="border-none col" :class="_customerCreationCheck
              ? 'bg-red-3 text-black text-bold'
              : 'bg-blue-4'
              " type="submit" no-caps dense :loading="_addLoading" :disable="_addLoading || _customerCreationCheck" />
          <q-btn v-if="_editMenuActive && !currentUser?.role.includes('WATCHER') && !selected.isEmergency"
            text-color="white" label="Изменить" unelevated class="border-none bg-blue-4 col" type="submit" no-caps
            dense></q-btn>
          <q-btn v-if="isCustomer &&
            !_creationMode &&
            !copyMode &&
            _approvementMenuActive &&
            !currentUser?.role.includes('WATCHER')
          " text-color="white" label="Удалить" unelevated class="border-none bg-red col" @click="onDecline" no-caps
            dense :disable="!declineReason">
            <q-tooltip v-if="!declineReason">Укажите причину удаления</q-tooltip>
          </q-btn>
          <q-btn v-if="!isCustomer && _removeMenuActive && !copyMode && !currentUser?.role.includes('WATCHER')"
            :disable="!removeReason" text-color="white" label="Удалить" unelevated class="border-none bg-red col"
            @click="onRemoveOrder" no-caps dense>
            <q-tooltip v-if="!removeReason" anchor="top middle">Укажите причину удаления</q-tooltip>
          </q-btn>
          <q-btn text-color="white" label="Отмена" unelevated class="border-none bg-green col" @click="onCancel()"
            no-caps dense />
        </div>
        <div class="col row q-gutter-x-sm items-center" v-if="!_creationMode &&
          selected &&
          selected.isRequest &&
          selected.isApproved &&
          !isCustomer &&
          currentUser?.id == 1
        ">
          <q-btn text-color="white" label="Принудительно завершить" unelevated class="border-none bg-orange col"
            @click="onComplete" no-caps dense />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";

import { showNotifyResult } from "src/helpers/notification";
import dayjs from "dayjs";
import CustomerSelect from "src/components/customer/form/fields/Customer.vue";
import PlaceSelect from "src/components/order/form/fields/Place.vue";
import PointsConstructor from "src/components/order/form/fields/Points.vue";
import DescriptionField from "src/components/order/form/fields/Description.vue";
import RemoveReasonField from "./fields/RemoveReason.vue";
import OrderTimePicker from "src/components/order/form/fields/Time.vue";
import { api, getConnection } from "src/boot/axios";
import { declineOrder } from "src/store/order/actions";
export default {
  name: "OrderCreation",
  props: ["selected", "isCustomer", "copyMode", 'cargoTypes'],
  components: {
    CustomerSelect,
    PlaceSelect,
    PointsConstructor,
    DescriptionField,
    RemoveReasonField,
    OrderTimePicker,
  },
  computed: {
    ...mapState("current", [
      "selectedTransportId",
      "orderIsEmergency",
      "removeOrderReason",
      "currentUser",
    ]),
    // ...mapGetters("transport", ["getByOnlyFreeFilter", "getTransportById"]),
    ...mapGetters("order", ["orderRoute"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapGetters("contact", ["getContactById"]),
    ...mapGetters("orderHistory", ["getRequestById"]),
    ...mapGetters("hierarchy", ["myUnusedLimit"]),
    _orderIsEmergency: {
      get() {
        return this.orderIsEmergency;
      },
      set(newVal) {
        this.setOrderIsEmergency(newVal);
        this.description = null;
      },
    },
    _orderCanBeEmergency: {
      get() {
        return (
          this.cargoTypes.find(
            (ct) => ct.id === this.points[0]?.cargo?.cargoTypeId
          )?.withEmergency ?? false
        );
      },
    },
    _isMetiz: {
      get() {
        return getConnection() == "mmkmetiz";
      },
    },
    _approvementMenuActive: {
      get() {
        if (this.currentUser?.role.includes("WATCHER")) return false;
        return (
          !this._creationMode &&
          this.selected &&
          this.selected.isRequest &&
          !this.selected.isApproved &&
          !this.selected.isDeclined
        );
      },
    },
    _editMenuActive: {
      get() {
        if (this.copyMode) return false;
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
        if (this.isCustomer) {
          return (
            !this._creationMode &&
            this.selected &&
            ((!this.selected.isDeclined) ||
              !this.selected.isRequest)
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
      set(newVal) {
        this.setRemoveOrderReason(newVal);
        this.removeReason = null;
      },
    },
    _customerCreationCheck: {
      get() {
        if (!this.isCustomer) return false;
        return this.myUnusedLimit != null && this.myUnusedLimit <= 0;
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
    ...mapActions("order", [
      "updateRoute",
      "backRoute",
      "completeRoute",
      "removeRoute",
      "addRoute",
    ]),
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
    buildRoute(ignoreDateTime = false) {
      let CurrentTime = new Date();
      CurrentTime.setMinutes(CurrentTime.getMinutes() + 15);
      if (this.orderTime < CurrentTime) {
        this.orderTime = CurrentTime;
      }
      return {
        // orderTime: ignoreDateTime
        //   ? this.orderTime
        //   : !this._creationMode && new Date() > this.orderTime
        //     ? new Date()
        //     : this.orderTime,
        orderTime: this.orderTime,
        departurePointName: this.departurePointName,
        isEmergency:
          !this._isMetiz || this._orderCanBeEmergency
            ? this._orderIsEmergency
            : false,
        transportId: this.isCustomer && this._creationMode ? null : this.selectedTransportId,
        customerPhoneNumber: this.customer.phoneNumber,
        customerFullname: this.customer.fullname,
        customerSubdivision: this.customer.subdivision,
        customermvz: this.customer.mvz,
        description: this.description,
        elements: this.points.map(this.buildPoint),
        isRequest: this.selected?.isRequest,
        isApproved: this.copyMode ? false : this.selected?.isApproved,
        isDeclined: this.copyMode ? false : this.selected?.isDeclined,
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
        cargoTypeId: point.cargo.cargoTypeId,
        withCargoTypeRequest: point.cargo.withCargoTypeRequest,
        name: point.cargo.withCargo ? point.cargo.name : "Пассажиры", // TODO Пассажиры
        isNew: this.copyMode ? true : point.isNew,
        existingId: this.copyMode ? null : point.existingId,
        forDelete: this.copyMode ? false : point.forDelete,
        cargoRecieverPhoneNumber: point.cargo.withCargo
          ? point.cargo.cargoReciever.phoneNumber
          : null,
        cargoRecieverFullname: point.cargo.withCargo
          ? point.cargo.cargoReciever.fullname
          : null,
        cargoRecieverSubdivision: point.cargo.withCargo
          ? point.cargo.cargoReciever.subdivision
          : null,
        cargoRecieverMvz: point.cargo.withCargo
          ? point.cargo.cargoReciever.mvz
          : null,
        scenario: point.cargo.withCargo && point.cargo.weight >= 60 ? 2 : 1,
      };
    },

    async onApprove() {
      //
      if (this.checkAlerts()) return;
      await this.updateRoute({
        id: this.selected.id,
        ...this.buildRoute(true),
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
        comment: this.declineReason,
        isApproved: false,
        isDeclined: true,
      });
      this.$refs.form.reset();
    },
    async onBackToRequest() {
      await this.backRoute({
        id: this.selected.id,
        ...this.buildRoute(),
        isApproved: false,
        isDeclined: false,
        isRequest: true,
        isDone: false
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
      this._creationMode || this.copyMode
        ? await this.onAddOrder()
        : await this.onUpdateOrder();
    },

    async onRemoveOrder() {
      //
      await this.removeRoute({
        id: this.selected.id,
        comment: this.removeReason,
      });
      this.$refs.form.reset();
    },
    async onComplete() {
      await this.completeRoute({
        id: this.selected.id,
        isApproved: true,
        isDeclined: false,
        isDone: true,
      });
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
          mvz: this.currentUser.mvz,
        };
      } else {
        this.customer = {
          fullname: null,
          subdivision: null,
          phoneNumber: null,
          mvz: null,
        };
      }
      this.departurePointName = null;
      this.orderTime = new Date();
      this.description = null;
      this.removeReason = null;
      this.declineReason = null;
      this.points = [];
      this.$emit("done");
      this.$emit("routeCopy", false);
    },
    loadData() {
      if (this.selected) {
        const order = this.selected.orders[0];

        this._orderIsEmergency = this.selected.isEmergency;

        this.orderTime = this.copyMode ? new Date() : new Date(order.orderTime);

        this.departurePointName = this.getPlaceById(
          order.departurePointId
        ).name;

        const { fullname, phoneNumber, subdivision, mvz } =
          this.getCustomerById(order.customerId);
        this.customer.fullname = fullname;
        this.customer.phoneNumber = phoneNumber;
        this.customer.subdivision = subdivision;
        this.customer.mvz = mvz;
        this.setCustomerSubdivision(subdivision);

        this.description = order.description;
        this.removeReason = order.removeReason;
        this.declineReason = order.declineReason;

        if (!this.copyMode) this.setSelectedTransportId(order.transportId);
        else this.setSelectedTransportId(null);

        this.points = this.selected.orders.map((o, index) => {
          const contact = this.getContactById(o.contactId);
          const cargoReciever = this.getCustomerById(o.cargoRecieverId);
          return {
            id: this.copyMode ? index : o.priority,
            statusId: o.statusId,
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
              cargoTypeId: o.cargoTypeId,
              withCargoTypeRequest: false,
              width: o.width,
              length: o.length,
              height: o.height,
              weight: o.weight,
              cargoReciever: {
                phoneNumber: cargoReciever?.phoneNumber ?? null,
                fullname: cargoReciever?.fullname ?? null,
                subdivision: cargoReciever?.subdivision ?? null,
                mvz: cargoReciever?.mvz ?? null,
              },
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
            mvz: this.currentUser.mvz,
          };
        } else {
          this.customer = {
            fullname: null,
            subdivision: null,
            phoneNumber: null,
            mvz: null,
          };
        }
        this.setCustomerSubdivision(this.customer.subdivision);
        this.orderTime = new Date();
        this._creationMode = true;
      }
    },
    dayjs,
  },
  async mounted() {
    if (this.$route.params.id) {
      const route = this.getRequestById(this.$route.params.id);
      this.$emit("routeSelected", route);
    }
    if (this.$route.params.copy != null && this.$route.params.copy === "copy") {
      this.$emit("routeCopy", true);
    }
    this.loadData();
  },
  data() {
    return {
      customer: {
        fullname: null,
        subdivision: null,
        phoneNumber: null,
        mvz: null,
      },
      departurePointName: null,
      orderTime: new Date(),
      description: null,
      removeReason: null,
      declineReason: null,
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
