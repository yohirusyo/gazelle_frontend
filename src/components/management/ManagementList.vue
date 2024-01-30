<template>
  <div class="column full-height">
    <div class="col col-shrink">
      <q-select :options="controlLimits" v-model="_selectedMonth" label="Месяц" square outlined dense
        @update:model-value="(val) => updateData(val)" :option-label="(item) => monthLabel(item)"
        class="text-black border-none q-pa-sm" />
    </div>
    <div class="col">
      <VScrolltable :rows="managements" :columns="columns" row-key="name">
        <template v-slot:body="props">
          <q-tr :props="props" @click="!currentUser?.role.includes('WATCHER') && !currentUser?.role.includes('OPERATOR') ? setManagement(props.row) : ''"
            class="text-center">
            <q-td auto-width>
              <q-checkbox v-model="props.expand" dense></q-checkbox>
            </q-td>
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="usedMonthLimit" :props="props">
              {{ round(props.row.limits[0].used) }}
            </q-td>
            <q-td key="factMonthLimit" :props="props">
              {{ round(props.row.limits[0].fact) }}
            </q-td>
            <q-td key="isMinutes" :props="props">
              {{ props.row.isMinutes ? "Минуты" : "Километры" }}
            </q-td>
            <q-td key="bossId" :props="props">
              {{ formatCustomer(getCustomerById(props.row.bossId)) }}
            </q-td>
          </q-tr>
          <q-tr v-if="props.expand">
            <q-td colspan="6">
              <OrderHistory :item="props.row.id" :operatingSpeedVariable="props.row.operatingSpeedVariable"
                :isMinutes="props.row.isMinutes" />
            </q-td>
          </q-tr>
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
      this.$emit("reqManagements", {year: item.year, month: item.month});
    },
  },
  data() {
    return {
      options: [],
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
          name: "usedMonthLimit",
          required: true,
          label: "Израсходованный месячный лимит",
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
      _selectedMonth: {year: dayjs().year(), month: dayjs().month()},
    };
  },
  computed: {
    ...mapState("management", ["managements"]),
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapState("current", ["currentUser"]),
    ...mapState("limit", ["controlLimits"]),
  },
  async mounted() {
    await this.getAllControlLimits();
  },
};
</script>

<style></style>
