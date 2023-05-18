<template>
  <Order
    :props="props"
    v-model="showed"
    :order="props.row.orders[0]"
    @onSelected="onSelected"
    :yesterdayTime="yesterdayTime"
  />
  <Order
    v-for="o of route"
    :key="o.id"
    :props="props"
    :order="o"
    v-if="showed || _hoveredOrder"
    @onSelected="onSelected"
    :yesterdayTime="yesterdayTime"
  />
</template>

<script>
import Order from "src/components/order/list/element/order/Order.vue";
import { mapState } from "vuex";
export default {
  props: ["props", "yesterdayTime"],
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
  },
};
</script>
