<template>
  <div
    class="column items-center justify-center"
    :class="swapped == orderId ? 'bg-yellow-4' : ''"
  >

  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
export default {
  props: ["orderId"],
  computed: {
    ...mapState("order", ["orders"]),
    ...mapGetters("order", ["filteredOrders", "getOrderById"]),
    ...mapGetters("status", ["getStatusById"]),
    ...mapState("current", ["swapped"]),
  },
  data() {
    return {
      nextOrder: null,
      prevOrder: null,
    };
  },
  mounted() {
    this.setPriority();
  },
  methods: {
    ...mapActions("order", ["swapPriority"]),
    ...mapMutations("current", ["setSwapped"]),
    setPriority() {
      this.nextOrder = this.findNextOrder(
        this.orders,
        this.getOrderById(this.orderId)
      );
      this.prevOrder = this.findPrevOrder(
        this.orders,
        this.getOrderById(this.orderId)
      );
      if (!!this.prevOrder || !!this.nextOrder) {
        document
          .querySelector(`#order-list-item-${this.orderId}`)
          ?.classList.remove("ignore-elements");
      } else {
        document
          .querySelector(`#order-list-item-${this.orderId}`)
          ?.classList.add("ignore-elements");
      }
    },
    findNextOrder(orders, order) {
      if (
        [
          "ACCEPTED",
          "ENTRY_TO_CUSTOMER",
          "ENTRY_TO_DESTINATION",
          "EXIT_TO_DESTINATION",
        ].includes(this.getStatusById(order?.statusId)?.code)
      )
        return null;
      if (order?.isRequest && !order?.isApproved) return null;
      return orders?.findLast((o) => {
        if (
          [
            "ACCEPTED",
            "ENTRY_TO_CUSTOMER",
            "ENTRY_TO_DESTINATION",
            "EXIT_TO_DESTINATION",
          ].includes(this.getStatusById(o?.statusId)?.code) ||
          (o?.isRequest && !o?.isApproved)
        )
          return false;
        return o?.priority < order?.priority && o?.id != order?.id;
      });
    },
    findPrevOrder(orders, order) {
      if (
        [
          "ACCEPTED",
          "ENTRY_TO_CUSTOMER",
          "ENTRY_TO_DESTINATION",
          "EXIT_TO_DESTINATION",
        ].includes(this.getStatusById(order?.statusId)?.code)
      )
        return null;
      if (order?.isRequest && !order?.isApproved) return null;
      return orders?.find((o) => {
        if (
          [
            "ACCEPTED",
            "ENTRY_TO_CUSTOMER",
            "ENTRY_TO_DESTINATION",
            "EXIT_TO_DESTINATION",
          ].includes(this.getStatusById(o?.statusId)?.code) ||
          (o?.isRequest && !o?.isApproved)
        )
          return false;
        return o?.priority > order?.priority && o?.id != order?.id;
      });
    },
  },
  watch: {
    orders: {
      handler(newOrders) {
        this.setPriority();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
