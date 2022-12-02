<template>
  <q-layout view="lHh lpR fFf">
    <q-header
      bordered
      class="bg-secondary text-white q-mx-xs border-bottom-md q-px-md"
    >
      <q-toolbar class="row justify-between">
        <div :class="$q.screen.xs ? '' : 'text-h5'">
          Автотранспортное Управление
          <!-- {{ "< blank >" }} -->
          <q-icon name="las la-truck" />
        </div>
        <div class="row items-center">
          <q-btn
            flat
            @click="drawer = !drawer"
            round
            dense
            icon="menu"
          />
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawer"
      :width="300"
      :breakpoint="500"
      side="right"
      overlay
      behavior="mobile"
      bordered
      class="bg-grey-3 column items-stretch"
    >
      <div class="q-mx-md q-mt-sm text-center">
        <span v-if="currentUser?.role != 'CUSTOMER'">
          {{ currentUser?.surname }}
          {{ currentUser?.name }}
          {{ currentUser?.middlename }}
        </span>
        <span v-else>
          {{ currentUser?.fullname }}
        </span>
        <div
          style="font-size: 0.8rem"
          class="text-grey"
        >
          {{ formatRole(currentUser?.role) }}
        </div>
      </div>

      <q-separator
        spaced
        inset
      />

      <q-btn
        text-color="black"
        label="Панель администратора"
        unelevated
        class="border-sm shadow-white col col-shrink q-ma-md q-pa-sm"
        to="/admin"
        flat
        no-caps
        v-if="currentUser?.role == 'ADMIN' && !$q.screen.xs"
      />

      <q-btn
        text-color="black"
        label="Пользователи"
        unelevated
        class="border-sm shadow-white col col-shrink q-ma-md q-pa-sm"
        to="/user"
        flat
        no-caps
        v-if="currentUser?.role == 'ADMIN'"
      />

      <q-btn
        text-color="black"
        :label="
          currentUser?.role != 'CUSTOMER'
            ? `Панель ${currentUser?.role == 'WATCHER' ? 'просмотра' : 'диспетчера'
            }`
            : 'Заказ'
        "
        unelevated
        class="border-sm shadow-white col col-shrink q-ma-md q-pa-sm"
        to="/"
        flat
        no-caps
      />

      <q-btn
        text-color="black"
        label="История заказов"
        unelevated
        class="border-sm shadow-white col col-shrink q-ma-md q-pa-sm"
        to="/history"
        flat
        no-caps
        v-if="currentUser?.role == 'CUSTOMER' && $q.screen.xs"
      />

      <q-btn
        text-color="black"
        label="Транспорт"
        unelevated
        class="border-sm shadow-white col col-shrink q-ma-md q-pa-sm"
        to="/transport"
        flat
        no-caps
        v-if="$q.screen.xs && currentUser?.role != 'CUSTOMER'"
      />

      <q-btn
        text-color="black"
        label="Водители"
        unelevated
        class="border-sm shadow-white col col-shrink q-ma-md q-pa-sm"
        to="/driver"
        flat
        no-caps
        v-if="currentUser?.role != 'WATCHER' && currentUser?.role != 'CUSTOMER'"
      />

      <q-btn
        text-color="black"
        label="Просмотреть отчет"
        unelevated
        class="border-sm shadow-white col col-shrink q-ma-md q-pa-sm"
        to="/report"
        flat
        no-caps
        v-if="
          currentUser?.role != 'WATCHER' &&
          !$q.screen.xs &&
          currentUser?.role != 'CUSTOMER'
        "
      />

      <q-btn
        text-color="black"
        icon-right="las la-sign-out-alt"
        unelevated
        class="border-sm shadow-white col col-shrink q-ma-md q-pa-sm"
        @click="logout"
        label="Выход"
        no-caps
        flat
      />
    </q-drawer>
    <q-page-container class="bg-accent">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { Loading } from "quasar";
import { formatRole } from "src/helpers/formatters.js";
export default {
  name: "MainLayout",
  components: {},
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    formatRole,
    ...mapActions("auth", ["logout"]),
    ...mapMutations("auth", ["setState"]),
    ...mapActions("current", ["requestCurrentUser"]),
    ...mapActions("transport", [
      "subscribeTransportSockets",
      "requestTransports",
    ]),
    ...mapActions("order", [
      "subscribeOrderSockets",
      "requestOrders",
      "requestNames",
    ]),
    ...mapActions("contact", ["subscribeContactSockets", "requestContacts"]),
    ...mapActions("customer", ["subscribeCustomerSockets", "requestCustomers"]),
    ...mapActions("place", ["subscribePlaceSockets", "requestPlaces"]),
    ...mapActions("user", [
      "subscribeUserSockets",
      "requestDrivers",
      "requestNonDrivers",
    ]),
    ...mapActions("status", ["requestStatuses"]),
  },
  computed: {
    ...mapState("current", ["currentUser"]),
  },
  created() {
    this.subscribeTransportSockets();
    this.subscribeOrderSockets();
    this.subscribeContactSockets();
    this.subscribeCustomerSockets();
    this.subscribePlaceSockets();
    this.subscribeUserSockets();
  },
  async mounted() {
    Loading.show();
    await this.requestCurrentUser();
    await this.requestTransports();
    await this.requestContacts();
    await this.requestCustomers();
    await this.requestPlaces();
    await this.requestOrders();
    await this.requestDrivers();
    await this.requestNonDrivers();
    await this.requestStatuses();

    await this.requestNames();
    Loading.hide();
  },
};
</script>
