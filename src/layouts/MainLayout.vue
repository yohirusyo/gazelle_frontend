<template>
  <q-layout view="lHh lpR fFf">
    <q-header bordered class="bg-white text-black">
      <q-toolbar class="row justify-between full-height q-pa-none">
        <div
          class="column items-center justify-center"
          style="
            width: 50px;
            height: 50px;
            border-right: 1px solid rgba(0, 0, 0, 0.12);
          "
        >
          <q-avatar
            @click="$router.push({ path: '/' })"
            style="cursor: pointer"
          >
            <img src="favicon.ico" />
          </q-avatar>
        </div>
        <div v-if="!$q.screen.xs" class="col text-h5">
          <div class="q-pl-md">Автотранспортное Управление</div>
        </div>
        <div
          class="q-pr-sm text-center col col-shrink column justify-center items-end"
        >
          <span v-if="currentUser?.role != 'CUSTOMER'">
            {{ currentUser?.surname }}
            {{ currentUser?.name }}
            {{ currentUser?.middlename }}
          </span>
          <span v-else>
            {{ currentUser?.fullname }}
          </span>
          <div style="font-size: 0.8rem" class="text-grey">
            {{ formatRole(currentUser?.role) }}
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-accent row">
      <div
        class="column bg-white q-py-sm justify-between items-center"
        style="width: 50px; border-right: 1px solid rgba(0, 0, 0, 0.12)"
      >
        <div class="column items-center q-gutter-y-md">
          <q-btn
            icon="las la-user-cog"
            to="/admin"
            flat
            dense
            v-if="currentUser?.role == 'ADMIN' && !$q.screen.xs"
          >
            <q-tooltip> Панель администратора </q-tooltip>
          </q-btn>

          <q-btn
            icon="las la-users"
            to="/user"
            flat
            dense
            v-if="currentUser?.role == 'ADMIN'"
          >
            <q-tooltip> Пользователи </q-tooltip>
          </q-btn>

          <q-btn icon="las la-list" to="/" flat dense>
            <q-tooltip>
              {{
                currentUser?.role != "CUSTOMER"
                  ? `Панель ${
                      currentUser?.role == "WATCHER"
                        ? "просмотра"
                        : "диспетчера"
                    }`
                  : "Заказ"
              }}
            </q-tooltip>
          </q-btn>

          <q-btn
            icon="las la-history"
            to="/history"
            flat
            dense
            v-if="currentUser?.role == 'CUSTOMER' && $q.screen.xs"
          >
            <q-tooltip> История заказов </q-tooltip>
          </q-btn>

          <q-btn
            icon="las la-truck"
            to="/transport"
            flat
            dense
            v-if="$q.screen.xs && currentUser?.role != 'CUSTOMER'"
          >
            <q-tooltip> Транспорт </q-tooltip>
          </q-btn>

          <q-btn
            icon="las la-id-card"
            to="/driver"
            flat
            dense
            v-if="
              currentUser?.role != 'WATCHER' && currentUser?.role != 'CUSTOMER'
            "
          >
            <q-tooltip> Водители </q-tooltip>
          </q-btn>

          <q-btn
            icon="las la-map"
            to="/map"
            flat
            dense
            v-if="
              currentUser?.role != 'WATCHER' && currentUser?.role != 'CUSTOMER'
            "
          >
            <q-tooltip> Карта </q-tooltip>
          </q-btn>

          <q-btn
            icon="las la-book"
            to="/report"
            flat
            dense
            v-if="
              currentUser?.role != 'WATCHER' &&
              // !$q.screen.xs &&
              currentUser?.role != 'CUSTOMER'
            "
          >
            <q-tooltip> Отчёт по заказам </q-tooltip>
          </q-btn>

          <q-btn
            icon="las la-book"
            to="/report-shifts"
            flat
            dense
            v-if="currentUser?.role == 'ADMIN'"
          >
            <q-tooltip> Отчёт по водителям </q-tooltip>
          </q-btn>

          <q-btn
            icon="las la-book"
            to="/report-operator-shifts"
            flat
            dense
            v-if="currentUser?.role == 'ADMIN'"
          >
            <q-tooltip> Отчёт по диспетчерам </q-tooltip>
          </q-btn>
        </div>

        <q-btn icon="las la-sign-out-alt" @click="logout" dense flat />
      </div>
      <router-view class="col" />
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
    Loading.show({ message: "Загрузка актуальной информации" });
    await Promise.all([
      this.requestCurrentUser(),
      this.requestTransports(),
      this.requestPlaces(),
      this.requestOrders(),
      this.requestDrivers(),
      this.requestNonDrivers(),
      this.requestStatuses(),
      this.requestContacts(),
      this.requestCustomers(),
      this.requestNames(),
    ]);
    Loading.hide();
  },
};
</script>
