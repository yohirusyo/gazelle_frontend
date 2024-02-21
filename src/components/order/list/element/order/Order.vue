<template>
  <q-tr
    :props="props"
    :class="_class"
    @click="handleClick"
    :id="'order-list-item-' + order.id"
  >
    <q-td key="expand" :props="props" :class="_latedClass">
      <SwitcherRouteShow
        v-model="_modelValue"
        :routeId="props.row.id"
        v-if="_isParent"
      />
      <div v-else-if="_isSolo">Одиночная</div>
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

    <q-td
      key="cargoPriority"
      :props="props"
      :class="
        getPriorityColor(
          _isParent && !_modelValue
            ? priority
            : getCargoTypePriority(order.cargoTypeId)
        )
      "
    >
      <span v-if="_isParent && !_modelValue">
        {{ getDescriptionByPriority(priority) }}
      </span>
      <span v-else>
        {{ getDescriptionByPriority(getCargoTypePriority(order.cargoTypeId)) }}
      </span>
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
import { getConnection } from "src/boot/axios";

const priorityNames = {
  3: "В",
  2: "С",
  1: "Н",
  0: "-",
};

const priorityColors = {
  3: "bg-red-11",
  2: "bg-yellow-11",
  1: "bg-green-11",
  0: "bg-grey-5",
};

export default {
  props: [
    "props",
    "modelValue",
    "order",
    "yesterdayTime",
    "cargoTypes",
    "priority",
  ],
  methods: {
    ...mapMutations("current", ["setOrder"]),
    onSelected(sel) {
      this.$emit("onSelected", sel);
    },
    dayjs,
    handleClick() {
      const canHandle = this.canHandleClick();
      if (canHandle) this.onSelected(this.order);
    },
    canHandleClick() {
      if (this.currentUser?.id === 1) return true;
      if (!this.order.isDone) return true;
      return false;
    },
    getCargoTypePriority(ctId) {
      return this.cargoTypes?.find((ct) => ct.id === ctId)?.priority ?? 0;
    },
    getDescriptionByPriority(priority) {
      return priorityNames[priority];
    },
    getPriorityColor(priority) {
      return priorityColors[priority];
    },
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
    ...mapState("current", [
      "selectedTransportId",
      "orderIsEmergency",
      "currentUser",
    ]),
    _isMetiz: {
      get() {
        return getConnection() == "mmkmetiz";
      },
    },
    _isParent: {
      get() {
        return (
          this.order.id == this.order.parentOrder &&
          this.props.row.orders.length != 1
        );
      },
    },
    _isSolo: {
      get() {
        return (
          this.props.row.orders.length == 1 || this.order.parentOrder == null
        );
      },
    },
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
    _latedClass() {
      const date1 = dayjs(this.order.orderTime);
      const date2 = dayjs();
      if (this.props.row.orders[0].statusId == 2 && this.priority === 3) {
        const diffTime = Math.abs(date1.diff(date2, "hour", true));
        if (diffTime > 1.5 && diffTime <= 2) return "bg-yellow-2";
        if (diffTime > 2) return "bg-red-2";
      }
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
