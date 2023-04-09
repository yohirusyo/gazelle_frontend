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
          <div class="q-pl-md" v-if="connection === 'atu'">
            Автотранспортное Управление
          </div>
          <div class="q-pl-md" v-if="connection === 'mmkmetiz'">ММК-Метиз</div>
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
            icon="las la-chart-pie"
            to="/limits"
            flat
            dense
            v-if="currentUser?.role == 'CUSTOMER' && myHierarchy"
          >
            <q-tooltip> Лимиты </q-tooltip>
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

        <q-btn
          icon="las la-sign-out-alt"
          @click="logout"
          dense
          flat
          v-if="!isMobile"
        />
      </div>
      <router-view class="col" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import { Loading } from "quasar";
import { formatRole } from "src/helpers/formatters.js";
import { getConnection } from "src/boot/axios";
export default {
  name: "MainLayout",
  components: {},
  data() {
    return {
      drawer: false,
      connection: getConnection(),
      isMobile: localStorage.getItem("mobile") === "true",
    };
  },
  methods: {
    formatRole,
    ...mapActions("auth", ["logout"]),
    ...mapMutations("auth", ["setState"]),
    ...mapActions("current", ["requestCurrentUser"]),
    ...mapActions("transport", ["requestTransports"]),
    ...mapActions("order", ["requestOrders", "requestNames"]),
    ...mapActions("contact", ["requestContacts"]),
    ...mapActions("customer", ["requestCustomers"]),
    ...mapActions("place", ["requestPlaces"]),
    ...mapActions("user", ["requestDrivers", "requestNonDrivers"]),
    ...mapActions("status", ["requestStatuses"]),
    ...mapActions("hierarchy", ["requestMyHierarchy"]),
  },
  computed: {
    ...mapState("current", ["currentUser"]),
    ...mapGetters("hierarchy", ["myHierarchy"]),
  },

  async mounted() {
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
      this.requestMyHierarchy(),
    ]);
  },
};
</script>
