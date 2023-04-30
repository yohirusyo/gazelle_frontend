<template>
  <div :style="`height: 100%`" class="q-gutter-y-sm">
    <Element
      class="column"
      v-for="order of orders"
      :key="order.id"
      :route="order"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

import Element from "./element/Element.vue";
export default {
  name: "OrderListMobile",
  props: ["col", "height"],
  components: {
    Element,
  },
  computed: {
    ...mapState("order", ["orders"]),
  },
};
</script>
