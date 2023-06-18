<template>
  <VScrolltable
    :rows="history"
    :columns="myManagement?.isMinutes ? minutesColumns : kilometersColumns"
    row-key="id"
  >
    <template v-slot:body="props">
      <Item :item="props.row" :isMinutes="myManagement?.isMinutes" />
    </template>
  </VScrolltable>
</template>

<script>
import { api } from "src/boot/axios";
import { mapGetters } from "vuex";
import Item from "./HistoryItem.vue";
import VScrolltable from "src/components/base/VScrolltable.vue";
export default {
  components: {
    Item,
    VScrolltable,
  },
  data() {
    return {
      history: [],
      minutesColumns: [
        {
          name: "date",
          required: true,
          label: "Дата",
          align: "center",
          sortable: false,
        },
        {
          name: "id",
          required: true,
          label: "№ заявки",
          align: "center",
          sortable: false,
        },
        {
          name: "time",
          required: true,
          label: "Время заявки (мин)",
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
        {
          name: "limitMin",
          required: true,
          label: "Списанный лимит (мин)",
          align: "center",
          sortable: false,
        },
      ],
      kilometersColumns: [
        {
          name: "date",
          required: true,
          label: "Дата",
          align: "center",
          sortable: false,
        },
        {
          name: "id",
          required: true,
          label: "№ заявки",
          align: "center",
          sortable: false,
        },
        {
          name: "time",
          required: true,
          label: "Время заявки (мин)",
          align: "center",
          sortable: false,
        },
        {
          name: "timeKilo",
          required: true,
          label: "Списанный лимит (км)",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
  async mounted() {
    this.fetchOrderStats(true);
  },
  computed: {
    ...mapGetters("management", ["myManagement"]),
  },
  methods: {
    async fetchOrderStats(onlyCurrent = true) {
      const { data } = await api.get("/order/hierarchy/order-stats", {
        params: { onlyCurrent: onlyCurrent ? 1 : 0 },
      });
      this.history = data;
    },
  },
};
</script>
