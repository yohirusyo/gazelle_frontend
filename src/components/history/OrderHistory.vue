<template>
  <div class="col bg-accent" ref="history">
    <div class="row col-12 q-pa-sm">
      <q-checkbox class="bg-white q-mr-sm" v-model="_activeOrder">
        <q-tooltip anchor="center left" self="center right">
          Только активные за все время
        </q-tooltip>
      </q-checkbox>
      <q-checkbox class="bg-white q-mr-sm" v-model="_myCustomerOrder">
        <q-tooltip anchor="center left" self="center right">
          Все заявки {{ currentUser.subdivision }}
        </q-tooltip>
      </q-checkbox>

      <q-btn :disabled="_activeOrder" text-color="white" :label="`с ${_selectedDate?.from} по ${_selectedDate?.to}`"
        unelevated class="col bg-white text-black border-none" flat no-caps>
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date v-model="_selectedDate" mask="DD.MM.YYYY" minimal range>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Применить" color="primary" flat @click="getOrderHistory()" />
              <q-btn v-close-popup label="Закрыть" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-btn>
    </div>

    <q-virtual-scroll :style="`height: ${height}px`" :items="history">
      <template v-slot="{ item }">
        <div>
          <div class="q-px-lg bg-white q-mb-sm sticky-item" v-if="item.head" style="font-size: 1.1rem">
            {{ dayjs(item.createdAt).locale("ru").format("D MMM, dddd") }}
          </div>

          <div class="bg-white q-pa-sm column q-mb-sm" radius="md" @click="editElement(item)">
            <div class="row justify-between">
              <div class="q-ml-md text-grey">Маршрут № {{ item.id }}</div>
              <div>
                <q-btn dense flat icon="lar la-copy" @click.stop.prevent="copyElement(item)" />
              </div>
            </div>

            <HistoryElement v-for="order of item.orders" :key="order.id" :order="order" />
          </div>
        </div>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import dayjs from "dayjs";
import HistoryElement from "./HistoryElement.vue";
import customParseFormat from "dayjs/plugin/customParseFormat";

export default {
  name: "OrderHistory",
  components: {
    HistoryElement,
  },
  computed: {
    ...mapGetters("orderHistory", [
      "getSortedHistory",
      "getMinSelectedDate",
      "getMaxSelectedDate",
    ]),
    ...mapState("current", ["currentUser"]),
    ...mapState("orderHistory", ["history"]),
    _isOnlyMy: {
      get() {
        return !!this.onlyMy;
      },
      set(newVal) {
        if (newVal) {
          this.onlyMy = this.currentUser.id;
        } else {
          this.onlyMy = null;
        }
      },
    },
  },

  data() {
    return {
      height: 0,
      onlyMy: null,
      _activeOrder: true,
      _myCustomerOrder: false,
      _selectedDate: null,
    };
  },
  async mounted() {
    this._selectedDate = {
      from: dayjs(dayjs()).subtract(1, 'weeks').format("DD.MM.YYYY"),
      to: dayjs(dayjs()).format("DD.MM.YYYY"),
    };
    dayjs.extend(customParseFormat);
    await this.requestHistory({
      onlyActiveOrderFlag: this._activeOrder, from: new Date(dayjs(this._selectedDate?.from, "DD.MM.YYYY")),
      to: new Date(
        dayjs(this._selectedDate?.to, "DD.MM.YYYY") + 3600 * 1000 * 24
      ), myCustomerOrderFlag: false
    });
    await this.subscribeHistorySockets();
    this.height = this.$refs.history.clientHeight - 65;
  },

  methods: {
    ...mapActions("orderHistory", [
      "requestHistory",
      "subscribeHistorySockets",
    ]),
    ...mapMutations("current", ["setRequest"]),
    dayjs,
    editElement(item) {
      if (
        this.currentUser.id == item.orders[0].customerId &&
        !item.isDeclined &&
        !item.isDone &&
        item.isRequest
      ) {
        if (this.$q.screen.xs) {
          this.$router.push({ path: `/${item.id}` });
        } else {
          this.$emit("routeSelected", item);
        }
      }
    },
    copyElement(item) {
      if (this.$q.screen.xs) {
        this.$router.push({ path: `/${item.id}/copy` });
      } else {
        this.$emit("routeSelected", item);
        this.$emit("routeCopy", true);
      }
    },
    async getOrderHistory() {
      await this.requestHistory({
        from: new Date(dayjs(this._selectedDate?.from, "DD.MM.YYYY")),
        to: new Date(
          dayjs(this._selectedDate?.to, "DD.MM.YYYY") + 3600 * 1000 * 24
        ),
        onlyActiveOrderFlag: this._activeOrder,
        myCustomerOrderFlag: this._myCustomerOrder,
      });
      await this.subscribeHistorySockets();
      this.height = this.$refs.history.clientHeight - 65;
    },
  },
  watch: {
    _selectedDate() {
      if (typeof this._selectedDate == "string") {
        this._selectedDate = {
          from: this._selectedDate,
          to: this._selectedDate,
        };
      }
    },
    _activeOrder() {
      this.getOrderHistory();
    },
    _myCustomerOrder() {
      this.getOrderHistory();
    },
  },
};
</script>

<style></style>
