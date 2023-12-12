<template>
  <q-page>
    <div class="column fit" style="flex-wrap: nowrap !important">
      <div class="col col-shrink">
        <div class="row" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)">
          <q-btn
            text-color="white"
            label="Экспорт в excel"
            icon="las la-file-excel"
            unelevated
            class="col bg-white text-black border-none"
            flat
            no-caps
            @click="createExcel"
          />
          <q-separator vertical />
          <q-btn
            text-color="white"
            :label="`с ${LabelDDMMYYYY(_selectedDate?.from)} по ${LabelDDMMYYYY(
              _selectedDate?.to
            )}`"
            unelevated
            class="col bg-white text-black border-none"
            flat
            no-caps
          >
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date
                v-model="_selectedDate"
                mask="DD.MM.YYYY HH:mm"
                minimal
                :options="optionsFn"
                range
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Закрыть" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
          <q-separator vertical />
          <q-btn
            text-color="white"
            :label="`с ${LabelHHmm(_selectedDate?.from)}`"
            unelevated
            class="col-shrink bg-white text-black border-none"
            flat
            no-caps
          >
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="_selectedDate.from" mask="DD.MM.YYYY HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Закрыть" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-btn>
          <q-separator vertical />
          <q-btn
            text-color="white"
            :label="`по ${LabelHHmm(_selectedDate?.to)}`"
            unelevated
            class="col-shrink bg-white text-black border-none"
            flat
            no-caps
          >
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="_selectedDate.to" mask="DD.MM.YYYY HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Закрыть" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-btn>
          <q-btn
            icon="search"
            label="сформировать"
            flat
            @click="requestSubdivisionStats(_selectedDate)"
          ></q-btn>
        </div>
      </div>
      <q-table
        separator="cell"
        flat
        dense
        :rows="subdivisionStats"
        :columns="columns"
        id="report-table"
        :rows-per-page-options="[0]"
        hide-bottom
      />
    </div>
  </q-page>
</template>

<script>
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

import { mapActions, mapGetters, mapState } from "vuex";
import * as XLSX from "xlsx-js-style";

export default {
  name: "report-subdivision",
  data() {
    return {
      _selectedDate: null,
      columns: [
        {
          name: "subdivision",
          required: false,
          label: "Подразделение",
          align: "center",
          field: (row) => row.subdivision,
          sortable: false,
        },
        {
          name: "count",
          required: false,
          label: "Создано заявок",
          align: "center",
          field: (row) => row.count,
          sortable: false,
        },
        {
          name: "isDone",
          required: false,
          label: "Выполнено заявок",
          align: "center",
          field: (row) => row.isDone,
          sortable: false,
        },
        {
          name: "isDeleted",
          required: false,
          label: "Удалено заявок",
          align: "center",
          field: (row) => row.isDeleted,
          sortable: false,
        },
        {
          name: "isDeclined",
          required: false,
          label: "Отклонено диспетчером",
          align: "center",
          field: (row) => row.isDeclined,
          sortable: false,
        },
      ],
    };
  },
  methods: {
    ...mapActions("orderStats", ["requestSubdivisionStats"]),
    // formatDate(val) {
    //   dayjs.extend(customParseFormat);
    //   dayjs.locale("ru");
    //   return dayjs(val, "DD.MM.YYYY").format("DD MMMM YYYY");
    // },
    LabelDDMMYYYY(val) {
      return dayjs(val, "DD.MM.YYYY HH:mm").format("DD.MM.YYYY");
    },
    LabelHHmm(val) {
      return dayjs(val, "DD.MM.YYYY HH:mm").format("HH:mm");
    },
    createExcel() {
      let excel = document.querySelector("#report-table");
      const ws = XLSX.utils.table_to_sheet(excel, { raw: true });
      const border = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      };
      ws["!cols"] = [
        { wch: 24 },
        { wch: 24 },
        { wch: 24 },
        { wch: 24 },
        { wch: 24 },
        { wch: 10 },
        { wch: 14 },
        { wch: 14 },
      ];

      ws["G1"] = {
        t: "s",
        v: "Дата",
      };

      ws["G2"] = {
        t: "s",
        v: `c ${this._selectedDate.from}`,
      };

      ws["H2"] = {
        t: "s",
        v: `по ${this._selectedDate.to}`,
      };

      for (let i = 1; i <= this.subdivisionStats.length + 1; i++) {
        const cell = ["A", "B", "C", "D", "E", "G", "H"];
        cell.forEach((m) =>
          !!ws[`${m}${i}`]
            ? (ws[`${m}${i}`].s = {
                border,
                alignment: {
                  horizontal: "center",
                },
              })
            : ""
        );
      }

      ws["!ref"] = `A1:H${this.subdivisionStats.length + 1}`;
      ws["!fullref"] = `A1:H${this.subdivisionStats.length + 1}`;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Отчет по подразделеням");
      XLSX.writeFile(wb, `Отчет ${dayjs().format("DD.MM.YYYY HH:mm")}.xlsx`);
    },
  },
  computed: {
    ...mapState("orderStats", ["subdivisionStats"]),
  },
  async mounted() {
    this._selectedDate = {
      from: dayjs().startOf("day").format("DD.MM.YYYY HH:mm"),
      to: dayjs().endOf("day").format("DD.MM.YYYY HH:mm"),
    };
    await this.requestSubdivisionStats(this._selectedDate);
  },
  watch: {
    _selectedDate() {
      if (typeof this._selectedDate == "string") {
        this._selectedDate = {
          from: dayjs(this._selectedDate, "DD.MM.YYYY HH:mm")
            .startOf("day")
            .format("DD.MM.YYYY HH:mm"),
          to: dayjs(this._selectedDate, "DD.MM.YYYY HH:mm")
            .endOf("day")
            .format("DD.MM.YYYY HH:mm"),
        };
      }
    },
  },
};
</script>
