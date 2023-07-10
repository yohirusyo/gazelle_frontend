<template>
  <VScrolltable :rows="managements" :columns="columns" row-key="name">
    <template v-slot:body="props">
      <q-tr
        :props="props"
        @click="setManagement(props.row)"
        class="text-center"
      >
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
          {{ props.row.limits[0].fact }}
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
          <OrderHistory
            :item="props.row.id"
            :operatingSpeedVariable="props.row.operatingSpeedVariable"
            :isMinutes="props.row.isMinutes"
          />
        </q-td>
      </q-tr>
    </template>
  </VScrolltable>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { formatCustomer } from "src/helpers/formatters";
import VScrolltable from "../base/VScrolltable.vue";
import OrderHistory from "../limits/History/OrderHistory.vue";

export default {
  components: {
    VScrolltable,
    OrderHistory,
  },
  props: ["col", "height"],
  methods: {
    ...mapMutations("current", ["setManagement"]),
    formatCustomer,
    round(num) {
      return Math.round(num * 100) / 100;
    },
  },
  data() {
    return {
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
    };
  },
  computed: {
    ...mapState("management", ["managements"]),
    ...mapGetters("customer", ["getCustomerById"]),
  },
};
</script>

<style></style>
