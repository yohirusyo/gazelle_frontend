<template>
  <div class="col bg-accent" ref="history">
    <div class="row col-12 q-pa-sm">
      <q-checkbox class="bg-white q-mr-sm" v-model="activeOrdersCheck">
        <q-tooltip anchor="center left" self="center right">
          Только активные
        </q-tooltip>
      </q-checkbox>

      <q-btn
        text-color="white"
        :label="`с ${_selectedDate?.from} по ${_selectedDate?.to}`"
        unelevated
        class="col bg-white text-black border-none"
        flat
        no-caps
      >
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date v-model="_selectedDate" mask="DD.MM.YYYY" minimal range>
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Применить"
                color="primary"
                flat
                @click="
                  this.getSortedHistory(this._activeOrder, {
                    from: this.getUnixDate(this._selectedDate?.from),
                    to: this.getUnixDate(this._selectedDate?.to),
                  })
                "
              />
              <q-btn v-close-popup label="Закрыть" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-btn>
    </div>

    <q-virtual-scroll :style="`height: ${height}px`" :items="getOrderHistory">
      <template v-slot="{ item }">
        <div
          class="q-px-lg bg-white q-mb-sm sticky-item"
          v-if="item.head"
          style="font-size: 1.1rem"
        >
          {{ dayjs(item.createdAt).locale("ru").format("D MMM, dddd") }}
        </div>
        <div
          class="bg-white q-pa-sm column q-mb-sm"
          radius="md"
          @click="editElement(item)"
        >
          <div class="row justify-between">
            <div class="q-ml-md text-grey">Маршрут № {{ item.id }}</div>
            <div>
              <q-btn
                dense
                flat
                icon="lar la-copy"
                @click.stop.prevent="copyElement(item)"
              />
            </div>
          </div>

          <HistoryElement
            v-for="order of item.orders"
            :key="order.id"
            :order="order"
          />
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
    ...mapGetters("orderHistory", ["getSortedHistory"]),
    ...mapState("current", ["currentUser"]),
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
    activeOrdersCheck: {
      get() {
        return this._activeOrder;
      },
      set(val) {
        this._activeOrder = !this._activeOrder;
      },
    },
    getOrderHistory: {
      get() {
        return this.getSortedHistory(this._activeOrder, {
          from: this.getUnixDate(this._selectedDate?.from),
          to: this.getUnixDate(this._selectedDate?.to),
        });
      },
    },
  },

  data() {
    return {
      height: 0,
      onlyMy: null,
      _activeOrder: false,
      _selectedDate: null,
    };
  },
  async mounted() {
    await this.requestHistory();
    await this.subscribeHistorySockets();
    this.height = this.$refs.history.clientHeight - 65;
    this._selectedDate = {
      from: dayjs().format("DD.MM.YYYY"),
      to: dayjs().format("DD.MM.YYYY"),
    };
    dayjs.extend(customParseFormat);
  },

  methods: {
    ...mapActions("orderHistory", [
      "requestHistory",
      "subscribeHistorySockets",
    ]),
    ...mapMutations("current", ["setRequest"]),
    dayjs,
    getUnixDate(date) {
      return dayjs(date, "DD.MM.YYYY").format("YYYY-MM-DD");
    },
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
  },
};
</script>

<style></style>
