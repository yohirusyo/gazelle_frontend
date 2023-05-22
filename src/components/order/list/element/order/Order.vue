<template>
  <q-tr
    :props="props"
    :class="_class"
    @click="order.isDone ? null : onSelected(order)"
    :id="'order-list-item-' + order.id"
  >
    <q-td key="expand" :props="props">
      <SwitcherRouteShow
        v-model="_modelValue"
        :routeId="props.row.id"
        v-if="order.id == order.parentOrder && props.row.orders.length != 1"
      />
      <div
        v-else-if="props.row.orders.length == 1 || order.parentOrder == null"
      >
        Одиночная
      </div>
      <div v-else class="column items-center">
        <q-icon
          class="q-ml-md"
          name="las la-level-up-alt"
          size="md"
          color="grey"
          style="transform: rotate(90deg)"
        />
        № {{ order.parentOrder }}
      </div>
    </q-td>
    <q-td key="time" :props="props">
      <Time
        :id="order.id"
        :isEmergency="order.isEmergency"
        :orderTime="order.orderTime"
        :name="order.name"
        :description="order.description"
        :class="_isYesterdayTime ? 'bg-blue' : ''"
        :maxWeight="_maxWeight"
        :createdAt="order.createdAt"
      />
    </q-td>
    <q-td key="customer" :props="props">
      <Customer :customerId="order.customerId" />
    </q-td>

    <q-td key="departurePoint" :props="props">
      <Place :placeId="order.departurePointId" />
    </q-td>
    <q-td key="destination" :props="props">
      <Place :placeId="order.destinationId" />
    </q-td>

    <q-td key="transportId" :props="props">
      <Transport :transportId="order.transportId" />
    </q-td>
    <q-td key="status" :props="props">
      <Status
        :statusId="order.statusId"
        :statusChangedAt="order.statusChangedAt"
        :isDone="order.isDone"
      />
    </q-td>
  </q-tr>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Time from "./Time.vue";
import Customer from "./Customer.vue";
import Place from "./Place.vue";
import Transport from "./Transport.vue";
import Status from "./Status.vue";
import SwitcherRouteShow from "./SwitcherRouteShow.vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
export default {
  props: ["props", "modelValue", "order", "yesterdayTime"],
  methods: {
    ...mapMutations("current", ["setOrder"]),
    onSelected(sel) {
      this.$emit("onSelected", sel);
    },
    dayjs,
  },
  components: {
    Time,
    Customer,
    Place,
    Transport,
    Status,
    SwitcherRouteShow,
  },
  computed: {
    ...mapState("order", ["hovered"]),
    _isYesterdayTime: {
      get() {
        return (
          dayjs(this.props.row.createdAt).utc() < dayjs.unix(this.yesterdayTime)
        );
      },
    },
    _orderClass() {
      if (
        this.hovered &&
        this.hovered.orders.map((o) => o.id).includes(this.order.id)
      )
        return "hovered-order";
      if (this.order.isRequest && !this.order.isApproved) return "bg-blue-2";
      if (this.order.isRequest && this.order.isApproved) return "bg-blue-1";
      return "";
    },
    _endedClass() {
      if (this.order.isDone) return "ended-order";
      return "";
    },
    _class() {
      return [this._orderClass, this._endedClass].join(" ");
    },
    _modelValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
    _maxWeight: {
      get() {
        return this.props.row.orders.reduce((prev, curr) => {
          if (curr.weight > prev) prev = curr.weight;
          return prev;
        }, 0);
      },
    },
  },
};
</script>
