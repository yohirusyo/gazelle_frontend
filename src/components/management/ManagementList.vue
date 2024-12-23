<template>
  <div class="column full-height">
    <div class="col col-shrink">
      <q-select :options="controlLimits" v-model="_selectedMonth" label="Месяц" square outlined dense
        @update:model-value="(val) => updateData(val)" :option-label="(item) => monthLabel(item)"
        class="text-black border-none q-pa-sm" />
    </div>
    <div class="col">
      <VScrolltable :rows="managements" :columns="columns" row-key="name" :key="_key">
        <template v-slot:body="props">
          <q-tr :props="props"
            @click="!currentUser?.role.includes('WATCHER') && !currentUser?.role.includes('OPERATOR') ? setManagement(props.row) : ''"
            class="text-center">
            <q-td auto-width>
              <q-checkbox v-model="props.expand" dense></q-checkbox>
            </q-td>
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="factMonthLimit" :props="props">
              {{ round(props.row.limits[0].fact) }}
            </q-td>
            <q-td key="usedMonthLimit" :props="props">
              {{ round(props.row.limits[0].used + props.row.limits[0].technologicalTransport) }}
            </q-td>
            <!-- <q-td key="isMinutes" :props="props">
              {{ props.row.isMinutes ? "Минуты" : "Километры" }}
            </q-td>
            <q-td key="bossId" :props="props">
              {{ formatCustomer(getCustomerById(props.row.bossId)) }}
            </q-td> -->
            <q-td key="whileNotDriving" :props="props">
              {{ findWhileDriving(props.row.id) }}
            </q-td>
            <q-td key="whileDriving" :props="props">
              {{ round(props.row.limits[0].used - findWhileDriving(props.row.id) +
                props.row.limits[0].technologicalTransport) }}
            </q-td>
          </q-tr>
          <q-tr v-if="props.expand">
            <q-td colspan="6">
              <OrderHistory :item="props.row.id" :operatingSpeedVariable="props.row.operatingSpeedVariable"
                :isMinutes="props.row.isMinutes" :selectedMonth="_selectedMonth" />
            </q-td>
          </q-tr>
          <div v-if="managements.length - 1 == props.pageIndex" class="absolute q-ml-sm ">
            <div v-if="!currentUser?.role.includes('WATCHER')" class="q-pt-sm">
              <q-table
                :title="`Запас: ${_fact.toFixed(2)} (лимит на месяц), ${managementsReserve.usedMonthLimit.toFixed(2)} (израсходованный лимит)`"
                :rows="managementsReserve.usedMonthLimitCustomers" :columns="columnsReserve" row-key="index" hide-bottom
                flat bordered />
            </div>
            <div v-if="currentUser?.role.includes('ADMIN') && connection == 'mmkmetiz'">
              <div>
                <br>
                <div class="text-h5 text-center">Пренос лимитов</div>
                <div class="row">
                  <q-select label="Откуда" class="text-black border-none q-pa-sm col" :options="managements"
                    :option-label="(item) => item.name" v-model="_selectedSubdivisionFrom" required />
                  <q-input label="Сколько" class="text-black border-none q-pa-md col" square outlined dense
                    hide-bottom-space hide-hint v-model="_limitTransfer" type="number" />
                  <q-select label="Куда" class="text-black border-none q-pa-sm col" :options="managements"
                    :option-label="(item) => item.name" v-model="_selectedSubdivisionTo" />
                </div>
                <div class="row q-ma-sm ">
                  <q-btn @click="saveLimitTransfer()" class="border-none bg-blue-4 col" text-color="white"
                    label="Перенести" unelevated no-caps dense />
                </div>
              </div>
              <div class="text-h5 text-center">История переносов:</div>
              <q-table :rows="getTransferLimits" :columns="columnHierachy" hide-bottom flat dense :key="_key"
                row-key="name" />
            </div>
          </div>

        </template>
      </VScrolltable>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { formatCustomer } from "src/helpers/formatters";
import { getConnection, api } from "src/boot/axios";
import VScrolltable from "../base/VScrolltable.vue";
import OrderHistory from "../limits/History/OrderHistory.vue";
import dayjs from "dayjs";
import _ from "lodash";
export default {
  components: {
    VScrolltable,
    OrderHistory,
  },
  props: ["col", "height"],
  methods: {
    ...mapMutations("current", ["setManagement"]),
    ...mapActions("limit", [
      "getAllControlLimits",
      "getLimitTransfer",
      "limitTransfer",
    ]),
    formatCustomer,
    round(num) {
      return Math.round(num * 100) / 100;
    },
    monthLabel(item) {
      return _.capitalize(dayjs(new Date(item.year, item.month, 1))
        .locale("ru")
        .format("MMMM YYYY"))
    },
    updateData(item) {
      this.$emit("reqManagements", { year: item.year, month: item.month });
    },
    findWhileDriving(id) {
      return this.managementsWhileDriving[id];
    },
    async loadData() {
    },

    async saveLimitTransfer() {
      await this.limitTransfer({
        senderId: this._selectedSubdivisionFrom.id,
        senderName: this._selectedSubdivisionFrom.name,
        receiverId: this._selectedSubdivisionTo.id,
        receiverName: this._selectedSubdivisionTo.name,
        amount: Number(this._limitTransfer),
        year: this._selectedMonth.year,
        month: this._selectedMonth.month
      }
      )
    },
  },
  data() {
    return {
      connection: getConnection(),
      _limitTransfer: null,
      _selectedSubdivisionFrom: null,
      _selectedSubdivisionTo: null,
      options: [],
      columnHierachy: [
        {
          name: 'sender',
          required: true,
          label: 'Откуда',
          align: 'center',
          field: row => row.senderName,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'amount',
          required: true,
          label: 'Сколько',
          align: 'center',
          field: row => row.amount,
          format: val => `${val}`,
          sortable: false
        },
        {
          name: 'receiver',
          required: true,
          label: 'Куда',
          align: 'center',
          field: row => row.receiverName,
          format: val => `${val}`,
          sortable: false
        }
      ],
      columnsReserve: [
        {
          name: 'subdivision',
          required: true,
          label: 'Подразделение',
          align: 'center',
          field: row => row.subdivision,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'fullname',
          required: true,
          label: 'Ответственный',
          align: 'center',
          field: row => row.fullname,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'phoneNumber',
          required: true,
          label: 'Телефон',
          align: 'center',
          field: row => row.phoneNumber,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'amount',
          required: true,
          label: 'Израсходовано',
          align: 'center',
          field: row => row.amount,
          format: val => `${val}`,
          sortable: true
        },
      ],
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
          name: "factMonthLimit",
          required: true,
          label: "Лимит на месяц",
          align: "center",
          sortable: false,
        },
        {
          name: "usedMonthLimit",
          required: true,
          label: "Израсходованный лимит",
          align: "center",
          sortable: false,
        },
        // {
        //   name: "isMinutes",
        //   required: true,
        //   label: "Единица измерения",
        //   align: "center",
        //   sortable: false,
        // },
        // {
        //   name: "bossId",
        //   required: false,
        //   label: "Главный ответственный",
        //   align: "center",
        //   sortable: false,
        // },
        {
          name: "whileDriving",
          required: true,
          label: "Во время движения",
          align: "center",
          sortable: false,
        },
        {
          name: "whileNotDriving",
          required: true,
          label: "На погрузке/разгрузке",
          align: "center",
          sortable: false,
        },
      ],
      _selectedMonth: { year: dayjs().year(), month: dayjs().month() },
      _key: new Date().getTime()
    };
  },
  computed: {
    ...mapState("management", ["managements", "managementsWhileDriving", "managementsReserve", "limitTransferState"]),
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapState("current", ["currentUser"]),
    ...mapState("limit", ["controlLimits", "getTransferLimits"]),
    factVolume: {
      get() {
        return this.managementsReserve.factMonthLimit * 1.12607971119134;
      },
    },
    _fact: {
      get() {
        return (
          this.factVolume -
          _.sumBy(this.managements, function (o) {
            return Number(o.limits[0].fact);
          })
        );
      },
    },
  },
  async mounted() {
    await this.getAllControlLimits();
    await this.getLimitTransfer({ year: dayjs().year(), month: dayjs().month() });
    await this.loadData();
  },
  watch: {
    _selectedMonth() {
      this._key = new Date().getTime()
    }
  }
};
</script>

<style></style>
