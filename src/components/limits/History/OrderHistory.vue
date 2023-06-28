<template>
  <VScrolltable
    :rows="history"
    :columns="myManagement?.isMinutes ? minutesColumns : kilometersColumns"
    row-key="owner"
    v-model:expanded="expanded"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />

        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-checkbox v-model="props.expand" dense />
        </q-td>

        <q-td key="customer">{{ props.row.owner }}</q-td>
        <q-td key="orderCount">{{ props.row.orderCount }}</q-td>
        <q-td key="limitMin" v-if="myManagement?.isMinutes">{{
          toMinutes(props.row.limitMin)
        }}</q-td>
        <q-td key="timeFine" v-if="myManagement?.isMinutes">{{
          toMinutes(props.row.fine)
        }}</q-td>
        <q-td key="limitKilo" v-if="!myManagement?.isMinutes">{{
          (props.row.limitKilo / 1000).toFixed(1)
        }}</q-td>
      </q-tr>
      <q-tr
        v-show="props.expand"
        :props="props"
        v-for="order of props.row.orders"
        :key="order.id"
      >
        <q-td colspan="3">Номер заявки: {{ order.id }} </q-td>
        <q-td v-if="myManagement?.isMinutes">{{
          toMinutes(order.limitMin)
        }}</q-td>
        <q-td v-if="myManagement?.isMinutes">{{ toMinutes(order.fine) }}</q-td>
        <q-td v-if="!myManagement?.isMinutes">{{
          (order.limitKilo / 1000).toFixed(1)
        }}</q-td>
      </q-tr>
    </template>
  </VScrolltable>
</template>

<script>
import { api } from "src/boot/axios";
import { mapGetters, mapState } from "vuex";
import VScrolltable from "src/components/base/VScrolltable.vue";
export default {
  components: {
    VScrolltable,
  },
  data() {
    return {
      history: [],
      expanded: [],
      fine: 15 * 60000,
      minutesColumns: [
        {
          name: "customer",
          required: true,
          label: "Ответственный",
          align: "center",
          sortable: false,
        },
        {
          name: "orderCount",
          required: true,
          label: "Количество заявок",
          align: "center",
          sortable: false,
        },
        {
          name: "limitMin",
          required: true,
          label: "Списанный лимит (мин)",
          align: "center",
          sortable: false,
        },
        {
          name: "timeFine",
          required: true,
          label: "Время штрафа (мин)",
          align: "center",
          sortable: false,
        },
      ],
      kilometersColumns: [
        {
          name: "customer",
          required: true,
          label: "Ответственный",
          align: "center",
          sortable: false,
        },
        {
          name: "orderCount",
          required: true,
          label: "Количество заявок",
          align: "center",
          sortable: false,
        },
        {
          name: "limitKilo",
          required: true,
          label: "Списанный лимит (км)",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
  async mounted() {
    this.fetchOrders();
  },
  computed: {
    ...mapGetters("management", ["myManagement"]),
    ...mapState("current", ["currentUser"]),
  },
  methods: {
    toMinutes(time) {
      if (!time) return "0.00";
      return (time / 60000).toFixed(2);
    },
    getLimitWithFine(time) {
      if (!time) return 0;
      return time > this.fine ? (time - this.fine) * 2 + this.fine : time;
    },
    parseNumber(number) {
      if (!number) return 0;
      return Number(number);
    },
    getTimeFine(item) {
      const loadingTime =
        !!item.loadingTime && this.parseNumber(item.loadingTime) > this.fine
          ? (this.parseNumber(item.loadingTime) - this.fine) * 2
          : 0;
      const unloadingTime =
        !!item.unloadingTime && this.parseNumber(item.unloadingTime) > this.fine
          ? (this.parseNumber(item.unloadingTime) - this.fine) * 2
          : 0;
      return loadingTime + unloadingTime;
    },
    getLimitMin(item) {
      const loadingTime = this.getLimitWithFine(
        this.parseNumber(item.loadingTime)
      );
      const unloadingTime = this.getLimitWithFine(
        this.parseNumber(item.unloadingTime)
      );
      return this.parseNumber(item.driveTime) + loadingTime + unloadingTime;
    },
    async fetchOrders() {
      const { data } = await api.get("/order/hierarchy/orders");
      const orders = [];
      for (const d of data) {
        const order = {
          id: d.order.id,
          fine: this.getTimeFine(d),
          limitMin: this.getLimitMin(d),
          limitKilo: this.parseNumber(d.order.routeLength),
        };
        const elem = orders.find((h) => h.owner == d.order.customer.fullname);
        if (elem) {
          elem.orderCount++;
          elem.fine += order.fine;
          elem.limitKilo += this.parseNumber(order.limitKilo);
          elem.limitMin += order.limitMin;
          elem.orders.push(order);
        } else {
          orders.push({
            owner: d.order.customer.fullname,
            orderCount: 1,
            fine: order.fine,
            limitMin: order.limitMin,
            limitKilo: this.parseNumber(order.limitKilo),
            orders: [order],
          });
        }
      }
      orders.sort((a, b) => {
        if (a.owner === this.currentUser.fullname) return -1;
        if (b.owner === this.currentUser.fullname) return 1;
        return 0;
      });
      this.history = orders;
    },
  },
};
</script>
