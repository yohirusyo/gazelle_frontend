<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-secondary text-white q-mx-xs border-bottom-md q-px-md">
      <q-toolbar class="row justify-between">
        <div class="text-h5">
          Автотранспортное Управление
          <!-- {{ "< blank >" }} -->
          <q-icon name="las la-truck" />
        </div>
        <div class="row items-center">
          <q-separator spaced inset vertical dark v-if="currentUser?.role == 'ADMIN'" />
          <q-btn text-color="white" label="Панель администратора" unelevated
            class="border-sm shadow-white col col-shrink" to="/admin" flat no-caps
            v-if="currentUser?.role == 'ADMIN'" />
          <q-separator spaced inset vertical dark />
          <q-btn text-color="white" label="Панель диспетчера" unelevated class="border-sm shadow-white col col-shrink"
            to="/" flat no-caps />
          <q-separator spaced inset vertical dark />
          <q-btn text-color="white" label="Просмотреть отчет" unelevated class="border-sm shadow-white col col-shrink"
            to="/report" flat no-caps />
          <q-separator spaced inset vertical dark />
          <div class="q-mx-md">
            {{ currentUser?.surname }}
            {{ currentUser?.name }}
            {{ currentUser?.middlename }}
          </div>
          <q-btn text-color="white" icon-right="las la-sign-out-alt" unelevated
            class="border-sm shadow-white col col-shrink" @click="logout" flat />
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-accent" >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import {
  Loading,
} from 'quasar'
export default {
  name: "MainLayout",
  components: {},
  methods: {
    ...mapActions("auth", ["logout"]),
    ...mapMutations("auth", ["setState"]),
    ...mapActions("current", ["requestCurrentUser"]),
    ...mapActions("transport", ["subscribeTransportSockets", "requestTransports"]),
    ...mapActions("order", ["subscribeOrderSockets", "requestOrders", "requestNames"]),
    ...mapActions("contact", ["subscribeContactSockets", "requestContacts"]),
    ...mapActions("customer", ["subscribeCustomerSockets", "requestCustomers"]),
    ...mapActions("place", ["subscribePlaceSockets", "requestPlaces"]),
    ...mapActions("user", ["subscribeUserSockets", "requestDrivers"]),
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
    await this.requestPlaces();
    await this.requestOrders();
    await this.requestDrivers();
    await this.requestStatuses();
    await this.requestContacts();
    await this.requestCustomers();
    await this.requestNames();
    Loading.hide();
  },
};
</script>
