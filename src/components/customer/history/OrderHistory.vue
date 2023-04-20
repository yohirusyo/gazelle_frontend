<template>
  <div class="col bg-accent" ref="history">
    <q-virtual-scroll
      :style="`height: ${height}px`"
      :items="getSortedHistory(onlyMy)"
    >
      <template v-slot="{ item }">
        <div
          class="q-px-lg bg-white q-mb-sm sticky-item"
          v-if="item.head"
          style="font-size: 1.1rem"
        >
          {{ moment(item.createdAt).lang("ru").format("D MMM, dddd") }}
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
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        :icon="!_isOnlyMy ? 'las la-user-alt' : 'las la-user-alt-slash'"
        color="primary"
        @click="_isOnlyMy = !_isOnlyMy"
      />
    </q-page-sticky>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import * as moment from "moment";
import HistoryElement from "./HistoryElement.vue";
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
  },
  data() {
    return {
      height: 0,
      onlyMy: null,
    };
  },
  async mounted() {
    await this.requestHistory();
    await this.subscribeHistorySockets();
    this.height = this.$refs.history.clientHeight;
  },
  methods: {
    ...mapActions("orderHistory", [
      "requestHistory",
      "subscribeHistorySockets",
    ]),
    ...mapMutations("current", ["setRequest"]),
    moment,
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
};
</script>

<style></style>
