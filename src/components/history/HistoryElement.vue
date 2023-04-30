<template>
  <div class="text-bold q-mx-md">
    {{
      (currentUser.id == order.customerId
        ? "Ваш з"
        : `(${getCustomerById(order.customerId)?.fullname})
        З`) +
      `аказ
                №${order.id}, ` +
      (order.orderTime
        ? `в ${moment(order.orderTime).format("HH:mm")}`
        : `время заказа не назначено`)
    }}
  </div>
  <div class="q-mx-md">
    {{
      `${getPlaceById(order.departurePointId)?.name} => ${
        getPlaceById(order.destinationId)?.name
      }`
    }}
  </div>
  <q-separator spaced inset />
  <div
    v-if="
      !order.isApproved && !order.isDeclined && !order.isDone && order.isRequest
    "
    class="text-blue q-mx-md"
  >
    Ожидает подтверждения диспетчера
  </div>
  <div
    v-else-if="
      ((order.isApproved && order.isRequest) || !order.isRequest) &&
      !order.isDone
    "
    class="text-green q-mx-md"
  >
    <div class="row items-center q-gutter-x-md justify-between">
      <span> Заказ выполняется </span>
      <Status
        :statusId="order.statusId"
        :statusChangedAt="order.statusChangedAt"
      />
    </div>

    <div class="row text-black items-center q-gutter-x-md justify-between">
      <AutoNumber
        :number="order.stats.transportNumber"
        class="col col-shrink"
      />
      <div class="col column items-end">
        <span>
          {{ order.stats.driverFullname }}
        </span>
        <span>
          {{ order.stats.driverPhoneNumber }}
        </span>
      </div>
    </div>
  </div>
  <div v-else-if="order.isDeclined && order.isRequest" class="text-red q-mx-md">
    Заказ отклонен диспетчером
  </div>
  <div v-else-if="order.isDone && !order.isDeleted" class="text-grey q-mx-md">
    Заказ выполнен
    {{
      order.routeLength != null && order.routeLength != 0
        ? `${(order.routeLength / 1000).toFixed(1)}км`
        : ""
    }}
    <div class="row text-black items-center q-gutter-x-md justify-between">
      <AutoNumber
        :number="order.stats.transportNumber"
        class="col col-shrink"
      />
      <div class="col column items-end">
        <span>
          {{ order.stats.driverFullname }}
        </span>
        <span>
          {{ order.stats.driverPhoneNumber }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import * as moment from "moment";
import AutoNumber from "src/components/base/AutoNumber.vue";
import Status from 'src/components/order/list/element/order/Status.vue'
export default {
  props: ["order"],
  components: {
    AutoNumber,
    Status,
  },
  computed: {
    ...mapState("current", ["currentUser"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("customer", ["getCustomerById"]),
    _transport: {
      get() {
        return this.getTransportById(this.order.transportId);
      },
    },
  },
  methods: {
    moment,
  },
};
</script>
