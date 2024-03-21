<template>
  <q-page>
    <div class="column fit" style="flex-wrap: nowrap !important">
      <div class="col col-shrink">
        <div class="row">
          <q-btn
            v-if="_selectedMonth"
            text-color="white"
            label="Экспорт в excel"
            icon="las la-file-excel"
            unelevated
            class="col bg-white text-black border-none"
            flat
            no-caps
            @click="createExcel"
          />
          <q-select
            :options="limitMonths"
            v-model="_selectedMonth"
            label="Месяц"
            square
            outlined
            dense
            @update:model-value="(val) => updateData(val)"
            :option-label="(item) => monthLabel(item)"
            class="col text-black border-none"
          />
        </div>
      </div>
      <q-table style="border-top: 1px solid rgba(0, 0, 0, 0.12)"
        id="report"
        v-if="_selectedMonth"
        separator="cell"
        flat

        dense
        :rows-per-page-options="[0]"
        hide-bottom
        :rows="indicatorStats"
        :columns="columns"
      >
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapState } from "vuex";
import _ from "lodash";
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import localizedFormat from "dayjs/plugin/localizedFormat";
import * as XLSX from "xlsx-js-style";

dayjs.extend(localizedFormat);
dayjs.extend(objectSupport);

export default {
  name: "indicator-report",
  data() {
    return {
      _selectedMonth: null,
      year: null,
      month: null,
      columns: [
        {
          name: "date",
          required: true,
          label: "Дата",
          align: "center",
          sortable: false,
          style: "width: 300px",
          field: (row) => dayjs(row.date).format("DD.MM.YYYY"),
        },
        {
          name: "length",
          required: true,
          label: "Создано заявок (процент выполнения)",
          align: "center",
          sortable: false,
          field: (row) => `${row.length} (${row.overallPercentage}%)`,
          style: "width: 300px",
          classes: (row) =>
            row.overallPercentage >= 98 ? "bg-green" : "bg-red",
        },
        {
          name: "priorityLength",
          required: true,
          label: "Создано заявок с высоким приоритетом (процент выполнения)",
          align: "center",
          sortable: false,
          style: "width: 300px",
          headerStyle: "white-space: normal",
          field: (row) => `${row.priorityLength} (${row.priorityPercentage}%)`,
          classes: (row) =>
            row.priorityPercentage >= 98 ? "bg-green" : "bg-red",
        },
        {
          name: "priorityPercentageLate",
          required: true,
          label:
            "Заявок выполнено с опозданием (процент выполнения без опоздания)",
          align: "center",
          sortable: false,
          style: "width: 300px",
          headerStyle: "white-space: normal",
          field: (row) => `${row.priorityLateLength} (${row.percentageLate})%`,
          classes: (row) => (row.percentageLate >= 90 ? "bg-green" : "bg-red"),
        },
      ],
    };
  },
  async mounted() {
    await this.getAllControlLimits();
  },
  methods: {
    ...mapActions("orderStats", ["getStatsIndicatorReport"]),
    ...mapActions("limit", ["getAllControlLimits"]),
    formatDate(date) {
      return dayjs(date).format("DD.MM.YYYY");
    },
    updateData(item) {
      this.getStatsIndicatorReport({ year: item.year, month: item.month });
    },
    monthLabel(item) {
      return _.capitalize(
        dayjs({ year: item.year, month: item.month })
          .locale("ru")
          .format("MMMM YYYY")
      );
    },
    createExcel() {
      let excel = document.querySelector("#report");
      const ws = XLSX.utils.table_to_sheet(excel, { raw: true });
      var sizes = XLSX.utils.decode_range(ws["!ref"]);

      const border = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      };
      ws["!rows"] = [
        {
          hpt: 30,
        },
      ];
      for (let i = 0; i <= sizes.e.c; i++) {
        ws["!cols"].push({ wch: 36 });
      }

      for (const key of Object.keys(ws)) {
        if (!key.includes("!")) {
          ws[key].s = {
            sz: 24,
            border,
            alignment: {
              horizontal: "center",
              wrapText: true,
              vertical: "center",
            },
          };
        }
        if (ws[key].v && ws[key].v.includes("%")) {
          const regex = /\((.*?)\)/g;
          const matches = ws[key].v.match(regex) || [];
          const number = matches.map((match) =>
            parseFloat(match.slice(1, -1))
          )[0];
          const percent = key.includes('C') ? 98 : 90
          ws[key].s = {
            ...ws[key].s,
            fill: { fgColor: { rgb: number > percent ? "4CAF50" : "F44336" } },
          };
        }
      }
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Счет-реестр автоуслуг по УС");

      XLSX.writeFile(wb, `Отчет ${dayjs().format("DD.MM.YYYY HH:mm")}.xlsx`);
    },
  },
  computed: {
    ...mapState("orderStats", ["indicatorStats"]),
    ...mapState("limit", ["controlLimits"]),
    limitMonths: {
      get() {
        return this.controlLimits;
      },
    },
  },
};
</script>
