<template>
  <Order
    :props="props"
    v-model="showed"
    :order="props.row.orders[0]"
    @onSelected="onSelected"
    :yesterdayTime="yesterdayTime"
    :cargoTypes="cargoTypes"
    :priority="getCargoTypePriority(props.row)"
  />
  <Order
    v-for="o of route"
    :key="o.id"
    :props="props"
    :order="o"
    v-if="showed || _hoveredOrder"
    @onSelected="onSelected"
    :yesterdayTime="yesterdayTime"
    :cargoTypes="cargoTypes"
  />
</template>

<script>
import Order from "src/components/order/list/element/order/Order.vue";
import { mapState } from "vuex";
export default {
  props: ["props", "yesterdayTime", "cargoTypes"],
  emits: {
    onSelected: null,
  },
  components: {
    Order,
  },
  data() {
    return {
      showed: false,
    };
  },
  computed: {
    ...mapState("order", ["hovered"]),

    _hoveredOrder: {
      get() {
        return this.props.row.id === this.hovered?.id;
      },
    },
    route: {
      get() {
        return this.props.row.orders.slice(1);
      },
    },
  },
  methods: {
    onSelected() {
      this.$emit("onSelected", this.props.row);
    },
    getCargoTypeById(id) {
      return this.cargoTypes?.find((ct) => ct.id == id);
    },
    getCargoTypePriority(route) {
      return route.orders.reduce((prev, curr) => {
        const currPriority =
          this.getCargoTypeById(curr.cargoTypeId)?.priority ?? 1;
        return currPriority > prev ? currPriority : prev;
      }, 1);
    },
  },
};
</script>
