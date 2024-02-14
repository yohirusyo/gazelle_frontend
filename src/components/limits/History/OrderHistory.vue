<template>

  <q-table wrap-cells hide-bottom :rows-per-page-options="[0]" table-header-class="bg-white" separator="cell"
    class="my-sticky-header-table" dense flat square :rows="_history"
    :columns="_isMinutes ? minutesColumns : kilometersColumns" row-key="owner" v-model:expanded="expanded">

    <template v-slot:header="props">
<q-th class="text-center" colspan="4" auto-width> {{ _selectedDate ? toDate(_selectedDate?.from) + " - " + toDate(_selectedDate?.to) : "" }} </q-th>

      <q-tr :props="props">

        <q-th auto-width>
          <q-icon name="calendar_month" color="black" size="sm">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="_selectedDate" mask="YYYYMMDD" minimal range>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Применить" color="primary" flat />
                  <q-btn v-close-popup label="Закрыть" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </q-th>
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          <div class="row items-center justify-center">
            <span class="col">{{ col.label }}</span>
            <q-checkbox v-if="col.name == 'limitKilo'" v-model="showCargoReciever" dense class="col"
              label="Лимит грузополучателя" />
          </div>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width v-if="!props.row.isTotal">
          <q-checkbox v-model="props.expand" dense />
        </q-td>
        <q-td v-else colspan="2" auto-width> Итого </q-td>

        <q-td key="customer" v-if="!props.row.isTotal">{{
          props.row.owner
        }}</q-td>
        <q-td key="orderCount">{{ props.row.orderCount }}</q-td>
        <q-td key="limitMin" v-if="_isMinutes">{{
          toMinutes(props.row.limitMin)
        }}</q-td>
        <q-td key="timeFine" v-if="_isMinutes">{{
          toMinutes(props.row.fine)
        }}</q-td>
        <q-td key="limitKilo" v-if="!_isMinutes">{{
          props.row.limitKilo.toFixed(2)
        }}</q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props" v-for="order of props.row.orders" :key="order.id">
        <q-td :colspan="_isMinutes ? 3 : 2">Заявка: {{ order.id }} </q-td>
        <q-td v-if="_isMinutes">{{ toMinutes(order.limitMin) }}</q-td>
        <q-td v-if="_isMinutes">{{ toMinutes(order.fine) }}</q-td>
        <q-td v-if="!_isMinutes" colspan="2">
          <table style="width: 100%">
            <colgroup>
              <col span="1" style="width: 60%" />
              <col span="1" style="width: 40%" />
            </colgroup>
            <tr>
              <td>Наименование</td>
              <td>Списано (км)</td>
            </tr>
            <tr v-if="order.limitKilo.customer">
              <td>Пробег</td>
              <td>
                {{ order.limitKilo.kilo }}
              </td>
            </tr>
            <tr v-if="order.limitKilo.customer">
              <td>Время ожидания погрузки</td>
              <td>
                {{ order.limitKilo.loadingWaitingTime }}
              </td>
            </tr>
            <tr v-if="order.limitKilo.customer">
              <td>Время погрузки</td>
              <td>
                {{ order.limitKilo.loadingTime }}
              </td>
            </tr>
            <tr v-if="order.limitKilo.customer">
              <td>Время ожидания после погрузки</td>
              <td>
                {{ order.limitKilo.afterLoadingWaitingTime }}
              </td>
            </tr>
            <tr v-if="order.limitKilo.cargoReciever">
              <td>Время ожидания разгрузки</td>
              <td>
                {{ order.limitKilo.unloadingWaiting }}
              </td>
            </tr>
            <tr v-if="order.limitKilo.cargoReciever">
              <td>Время разгрузки</td>
              <td>
                {{ order.limitKilo.unloadingTime }}
              </td>
            </tr>
            <tr>
              <td>Итого</td>
              <td>
                {{ order.limitKilo.limit }}
              </td>
            </tr>
          </table>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { api } from "src/boot/axios";
import { mapGetters, mapState } from "vuex";
import VScrolltable from "src/components/base/VScrolltable.vue";
export default {
  components: {
    VScrolltable,
  },
  props: ["item", "operatingSpeedVariable", "isMinutes", "selectedMonth"],
  data() {
    return {
      _selectedDate:{
        from:null,
        to: null
      },
      history: [],
      expanded: [],
      fine: 15 * 60000,
      showCargoReciever: true,
      _customerIds: [],
      _orders: [],
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
    this._selectedDate.from = dayjs(`${this.selectedMonth.month+1}-${this.selectedMonth.year}`, 'M-YYYY').startOf('month').format('YYYYMMDD'),
    this._selectedDate.to = dayjs(`${this.selectedMonth.month+1}-${this.selectedMonth.year}`, 'M-YYYY').endOf('month').format('YYYYMMDD'),
    this.fetchOrders();
  },
  computed: {
    ...mapGetters("management", ["myManagement", "getManagementById"]),
    ...mapState("current", ["currentUser"]),
    _isMinutes: {
      get() {
        return this.item ? this.isMinutes : this.myManagement?.isMinutes;
      },
    },
    _operatingSpeedVariable: {
      get() {
        return this.item
          ? this.operatingSpeedVariable
          : this.myManagement?.operatingSpeedVariable;
      },
    },
    _management: {
      get() {
        return this.item
          ? this.getManagementById(this.item)
          : this.myManagement;
      },
    },
    _history: {
      get() {
        const orders = [];
        const total = {
          orderCount: 0,
          fine: 0,
          limitMin: 0,
          limitKilo: 0,
          orders: [],
          isTotal: true,
        };
        for (const d of this._orders) {
          const orderDate = d.order.orderTime.split("T")[0].split("-").join("");
          if (
            !this._selectedDate ||
            (this._selectedDate.from <= orderDate &&
              orderDate <= this._selectedDate.to)
          ) {
            const kiloData = this.getKilos(d, this._customerIds);
            if (!this.showCargoReciever && kiloData.cargoReciever) continue;
            const order = {
              id: d.order.id,
              fine: this.getTimeFine(d),
              limitMin: this.getLimitMin(d),
              limitKilo: kiloData,
              isTotal: false,
            };
            const elem = orders.find(
              (h) => h.owner == d.order.customer.fullname
            );
            if (elem) {
              elem.orderCount++;
              elem.fine += order.fine;
              elem.limitKilo += kiloData.limit;
              elem.limitMin += order.limitMin;
              elem.orders.push(order);
            } else {
              orders.push({
                owner: d.order.customer.fullname,
                orderCount: 1,
                fine: order.fine,
                limitMin: order.limitMin,
                limitKilo: kiloData.limit,
                orders: [order],
              });
            }
            total.orderCount++;
            total.fine += order.fine || 0;
            total.limitKilo += order.limitKilo.limit || 0;
            total.limitMin += order.limitMin || 0;
          }
        }
        orders.sort((a, b) => {
          if (a.owner === this.currentUser.fullname) return -1;
          if (b.owner === this.currentUser.fullname) return 1;
          return 0;
        });
        orders.push(total);
        return orders;
      },
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
  // mounted(){
  //   this._selectedDate.from = moment(`${this.selectedMonth.month+1}-${this.selectedMonth.year}`, 'M-YYYY').startOf('month').format('YYYYMMDD'),
  //   this._selectedDate.to = moment(`${this.selectedMonth.month+1}-${this.selectedMonth.year}`, 'M-YYYY').endOf('month').format('YYYYMMDD'),
  //   console.log(this._selectedDate);
  // },
  methods: {
    toDate(val) {
      dayjs.extend(customParseFormat)
      return dayjs(val).format('DD.MM.YYYY')
    },
    toMinutes(time) {
      if (!time) return "0.00";
      return (time / 60000).toFixed(2);
    },
    toHours(millisec) {
      if (!millisec || isNaN(Number(millisec))) return 0;
      return Number(millisec) / (60000 * 60);
    },
    getLimitWithFine(time) {
      if (!time) return 0;
      return time > this.fine ? (time - this.fine) * 2 + this.fine : time;
    },
    parseNumber(number) {
      if (!number) return 0;
      return Number(number);
    },
    metersToKilo(meters) {
      if (!meters || meters == 0) return 0;
      return Number((meters / 1000).toFixed(1));
    },
    getKilos(stats, customerIds) {
      const limit = {
        cargoReciever: false,
        customer: false,
        limit: 0,
        kilo: 0,
        loadingWaitingTime: 0,
        loadingTime: 0,
        afterLoadingWaitingTime: 0,
        unloadingWaiting: 0,
        unloadingTime: 0,
      };
      if (customerIds.includes(stats.order.customerId)) {
        limit.customer = true;
        limit.kilo = this.metersToKilo(stats.order.routeLength);
        limit.loadingWaitingTime =
          this._operatingSpeedVariable * this.toHours(stats.loadingWaitingTime);
        limit.loadingTime =
          this._operatingSpeedVariable * this.toHours(stats.loadingTime);
        limit.afterLoadingWaitingTime =
          this._operatingSpeedVariable *
          this.toHours(stats.afterLoadingWaitingTime);
        limit.limit +=
          limit.kilo +
          limit.loadingWaitingTime +
          limit.loadingTime +
          limit.afterLoadingWaitingTime;
      }
      if (customerIds.includes(stats.order.cargoRecieverId)) {
        limit.cargoReciever = true;
        limit.unloadingWaiting =
          this._operatingSpeedVariable * this.toHours(stats.unloadingWaiting);
        limit.unloadingTime =
          this._operatingSpeedVariable * this.toHours(stats.unloadingTime);
        limit.limit += limit.unloadingWaiting + limit.unloadingTime;
      }
      limit.limit = Math.round(limit.limit * 100) / 100;
      limit.kilo = Math.round(limit.kilo * 100) / 100;
      limit.loadingWaitingTime =
        Math.round(limit.loadingWaitingTime * 100) / 100;
      limit.loadingTime = Math.round(limit.loadingTime * 100) / 100;
      limit.afterLoadingWaitingTime =
        Math.round(limit.afterLoadingWaitingTime * 100) / 100;
      limit.unloadingWaiting = Math.round(limit.unloadingWaiting * 100) / 100;
      limit.unloadingTime = Math.round(limit.unloadingTime * 100) / 100;
      return limit;
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
      const { data } = await api.get(
        `/order/hierarchy/orders/${this.item ? this.item : ""}/${this.selectedMonth.year}/${this.selectedMonth.month}`
      );
      this._orders = data.orders;
      this._customerIds = data.customerIds;
    },
  },
};
</script>

<style>
.q-date__navigation {
  display: none !important;
}
</style>
