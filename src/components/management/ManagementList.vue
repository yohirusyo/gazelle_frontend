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
              {{ round(props.row.limits[0].used - findWhileDriving(props.row.id) + props.row.limits[0].technologicalTransport) }}
            </q-td>
          </q-tr>
          <q-tr v-if="props.expand">
            <q-td colspan="6">
              <OrderHistory :item="props.row.id" :operatingSpeedVariable="props.row.operatingSpeedVariable"
                :isMinutes="props.row.isMinutes" :selectedMonth="_selectedMonth" />
            </q-td>
          </q-tr>
          <div v-if="managements.length - 1 == props.pageIndex" class="absolute q-ml-sm ">
            <div class="q-pt-sm">
              <q-table
                :title="`Запас: ${_plan.toFixed(2)} (лимит на месяц), ${managementsReserve.usedMonthLimit.toFixed(2)} (израсходованный лимит)`"
                :rows="managementsReserve.usedMonthLimitCustomers" :columns="columnsReserve" row-key="index" hide-bottom flat bordered/>
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
  },
  data() {
    return {
      options: [],
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
    ...mapState("management", ["managements", "managementsWhileDriving", "managementsReserve"]),
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapState("current", ["currentUser"]),
    ...mapState("limit", ["controlLimits"]),
    planVolume: {
      get() {
        return this.managementsReserve.factMonthLimit * 1.12607971119134;
      },
    },
    _plan: {
      get() {
        return (
          this.planVolume -
          _.sumBy(this.managements, function (o) {
            return Number(o.limits[0].plan);
          })
        );
      },
    },
  },
  async mounted() {
    await this.getAllControlLimits();
  },
  watch: {
    _selectedMonth() {
      this._key = new Date().getTime()
    }
  }
};
</script>

<style></style>
