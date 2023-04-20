<template>
  <q-page class="row bg-white">
    <div
      class="col"
      :class="{ 'q-pa-md': !$q.screen.xs }"
      style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <MenuItemV2 :col="col" label="Заказы" v-model="_route" :onlyCreate="true">
        <template #create="{ onDone, selected }">
          <OrderCreation
            @done="onDone"
            :selected="selected"
            :isCustomer="true"
            @routeSelected="setRoute"
            @routeCopy="setCopy"
            :copyMode="_copy"
          />
        </template>
      </MenuItemV2>
    </div>
    <div class="col column" v-if="!$q.screen.xs">
      <OrderHistory
        v-if="!$q.screen.xs"
        class="col"
        @routeSelected="setRoute"
        @routeCopy="setCopy"
      />
    </div>
  </q-page>
</template>

<script>
import OrderHistory from "src/components/customer/history/OrderHistory.vue";
import MenuItemV2 from "src/components/base/MenuItemV2.vue";
import OrderCreation from "src/components/order/OrderCreation.vue";
export default {
  components: {
    OrderHistory,
    MenuItemV2,
    OrderCreation,
  },
  computed: {
    _route: {
      get() {
        return this.route;
      },
      set(val) {
        this.route = val;
      },
    },
    _copy: {
      get() {
        return this.copy;
      },
      set(val) {
        this.copy = val;
      },
    },
  },
  data() {
    return {
      route: null,
      copy: false,
    };
  },
  methods: {
    setRoute(route) {
      this._route = route;
    },
    setCopy(val) {
      this._copy = val;
    },
  },
};
</script>
