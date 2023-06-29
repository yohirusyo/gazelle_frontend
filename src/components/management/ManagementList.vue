<template>
  <VScrolltable :rows="managements" :columns="columns" row-key="name">
    <template v-slot:body="props">

      <q-tr :props="props" @click="setManagement(props.row)" class="text-center">

        <q-td>
          <q-checkbox v-model="props.expand" @update:model-value="fetchOrders(props.row.id)" :props="history"></q-checkbox>
        </q-td>

        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="planMonthLimit" :props="props">
          {{ props.row.limits[0].plan }}
        </q-td>
        <q-td key="factMonthLimit" :props="props">
          {{ props.row.limits[0].fact }}
        </q-td>
        <q-td key="isMinutes" :props="props">
          {{ props.row.isMinutes ? "Минуты" : "Километры" }}
        </q-td>
        <q-td key="bossId" :props="props">
          {{ formatCustomer(getCustomerById(props.row.bossId)) }}
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="history">
          <q-td>{{history}}</q-td>
        </q-tr>
    </template>
  </VScrolltable>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { formatCustomer } from "src/helpers/formatters";
import VScrolltable from "../base/VScrolltable.vue";
import { api } from "src/boot/axios";

export default {
  components: {
    VScrolltable,
  },
  props: ["col", "height"],
  methods: {
    ...mapMutations("current", ["setManagement"]),
    formatCustomer,
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
    parseNumber(number) {
      if (!number) return 0;
      return Number(number);
    },
    getLimitWithFine(time) {
      if (!time) return 0;
      return time > this.fine ? (time - this.fine) * 2 + this.fine : time;
    },
    parseNumber(number) {
      if (!number) return 0;
      return Number(number);
    },
    async fetchOrders(id) {
      console.log(typeof id);
      const { data } = await api.get(`order/hierarchy/orders/${id}?managementId=${id}`);
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
  data() {
    return {
      history: [12,23,34],
      columns: [
        {
          name: "orders",
          required: true,
          label: "Заявки",
          align: "center",
          sortable: false,
        },
        {
          name: "name",
          required: true,
          label: "Название",
          align: "center",
          sortable: false,
        },
        {
          name: "planMonthLimit",
          required: true,
          label: "Плановый месячный лимит",
          align: "center",
          sortable: false,
        },
        {
          name: "factMonthLimit",
          required: true,
          label: "Фактический месячный лимит",
          align: "center",
          sortable: false,
        },
        {
          name: "isMinutes",
          required: true,
          label: "Единица измерения",
          align: "center",
          sortable: false,
        },
        {
          name: "bossId",
          required: false,
          label: "Главный ответственный",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState("management", ["managements"]),
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapState("current", ["currentUser"]),
  },

};
</script>

<style></style>
