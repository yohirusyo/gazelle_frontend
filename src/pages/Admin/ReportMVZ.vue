<template>
  <q-page>
    <div class="column fit" style="flex-wrap: nowrap !important">
      <div class="col col-shrink">
        <div class="row" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)">
          <q-input
            outlined
            label="Введите сумму за единицу"
            class="col"
            flat
            dense
            type="number"
            v-model="sum"
          ></q-input>
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
          <q-btn
            text-color="white"
            :label="`с ${_selectedDate?.from} по ${_selectedDate?.to}`"
            unelevated
            class="col bg-white text-black border-none"
            flat
            no-caps
          >
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="_selectedDate" mask="DD.MM.YYYY" minimal range>
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    label="Применить"
                    color="primary"
                    flat
                    @click="requestMvzStats(_selectedDate)"
                  />
                  <q-btn v-close-popup label="Закрыть" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
        </div>
      </div>
      <div class="col">
        <VScrolltable
          :rows="calculateMvzLimits(sum)"
          :report="false"
          :columns="columns"
          rowKey="mvz"
          id="report-table"
        />

        <table ref="export" style="border-collapse: collapse">
          <tr></tr>
          <tr>
            <td colspan="6">
              Счет-реестр оказания автоуслуг за период с
              {{ formatDate(_selectedDate?.from) }} г. по
              {{ formatDate(_selectedDate?.to) }} г.
            </td>
          </tr>
          <tr></tr>
          <tr>
            <td colspan="6">
              Заказчик: ОАО "Магнитогорский метизно-калибровочный завод
              "ММК-МЕТИЗ"
            </td>
          </tr>
          <tr>
            <td colspan="6">Подразделение:</td>
          </tr>
          <tr>
            <td colspan="6">Подрядчик: ООО "Автотранспортное управление"</td>
          </tr>
          <tr></tr>

          <tr>
            <td colspan="2">Кол-во км</td>
            <td>Стоимость без НДС, руб</td>
          </tr>

          <!-- всё, кроме итого -->
          <div v-for="(el, index) of excelData" :key="index">
            <div v-if="el.mvz != `Итого` && el.mvz != `null`">
              <tr>
                <td colspan="3">{{ el.mvz }}</td>
              </tr>
              <tr>
                <td colspan="2">{{ toFixedFunc(el.limit) }}</td>
                <td colspan="2">{{ toFixedFunc(el.sum) }}</td>
              </tr>
            </div>
          </div>

          <!-- только итого -->
          <div v-for="(el, index) of excelData" :key="index">
            <div v-if="el.mvz == `Итого`">
              <tr>
                <td>{{ el.mvz }}</td>
                <td>{{ toFixedFunc(el.limit) }}</td>
                <td>{{ toFixedFunc(el.sum) }}</td>
              </tr>
            </div>
          </div>
        </table>
      </div>
    </div>
  </q-page>
</template>

<script>
import dayjs from "dayjs";
import { mapActions, mapGetters, mapState } from "vuex";
import VScrolltable from "src/components/base/VScrolltable.vue";
import * as XLSX from "xlsx-js-style";
import customParseFormat from "dayjs/plugin/customParseFormat";

export default {
  name: "report-mvz",
  components: {
    VScrolltable,
  },
  data() {
    return {
      _selectedDate: null,
      sum: 0,
      columns: [
        {
          name: "mvz",
          required: false,
          label: "МВЗ",
          align: "center",
          field: (row) => row.mvz,
          sortable: false,
        },
        {
          name: "limit",
          required: false,
          label: "Кол-во км",
          align: "center",
          field: (row) => Number(row.limit.toFixed(2)),
          sortable: false,
        },
        {
          name: "limit",
          required: false,
          label: "Стоимость (руб)",
          align: "center",
          field: (row) => Number(row.sum.toFixed(2)),
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState("orderStats", ["mvzStats", "excelData"]),
    ...mapGetters("orderStats", ["calculateMvzLimits"]),
  },
  methods: {
    ...mapActions("orderStats", ["requestMvzStats"]),
    createExcel() {
      let excel = this.$refs.export;
      const ws = XLSX.utils.table_to_sheet(excel, { raw: true });
      ws["!cols"] = [
        { wch: 12 },
        { wch: 12 },
        { wch: 24 },
        { wch: 24 },
        { wch: 24 },
        { wch: 24 },
        { wch: 24 },
      ];
      let cells1 = ["A2", "A4", "A5", "A6"];
      cells1.forEach((cell) => {
        ws[cell].s = {
          font: {
            name: "Arial",
            sz: 9,
          },
        };
      });
      let cells2 = ["A8", "C8"];
      cells2.forEach((cell) => {
        ws[cell].s = {
          font: {
            name: "Verdana",
            sz: 9,
            bold: true,
          },
        };
      });
      let cells3 = ["A9", "A11", "A13", "A15", "A17", "A19", "A21", "A25", "A27", "A29", "A31", "A33"];

      cells3.forEach((cell) => {
        if (Object.keys(ws).includes(cell)) {
          ws[cell].s = {
            font: {
              name: "Verdana",
              sz: 9,
              bold: true,
            },
            fill: {
              fgColor: { rgb: "BFBFBF" },
            },
          };
        }
      });
      const lastIndex =
        ws[Object.keys(ws)[Object.keys(ws).length - 1]].substr(-2);
      let cells4 = [`A${lastIndex}`, `B${lastIndex}`, `C${lastIndex}`];
      cells4.forEach((cell) => {
        ws[cell].s = {
          font: {
            name: "Calibri",
            sz: 11,
            bold: true,
          },
            fill: {
              fgColor: { rgb: "BFBFBF" },
            },
        };
      });
      //       let cells5 = ["A8", "C8"]; // B8 не видит
      // cells5.forEach((cell) => {
      //   ws[cell].s = {
      //     border: {
      //       top: { style: "thin", color: {rgb: "000000"} },
      //       bottom: { style: "thin", color: {rgb: "000000"} },
      //       left: { style: "thin", color: {rgb: "000000"} },
      //       right: { style: "thin", color: {rgb: "000000"} }
      //     }
      //   };
      // });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Отчет по мвз");
      XLSX.writeFile(wb, `Отчет ${dayjs().format("DD.MM.YYYY HH:mm")}.xlsx`);
    },
    toFixedFunc(el) {
      return String(Number(el.toFixed(2))).replace(".", ",");
    },
    formatDate(val) {
      dayjs.extend(customParseFormat);
      dayjs.locale("ru");
      return dayjs(val, "DD.MM.YYYY").format("DD MMMM YYYY");
    },
  },
  async mounted() {
    this._selectedDate = {
      from: dayjs().format("DD.MM.YYYY"),
      to: dayjs().format("DD.MM.YYYY"),
    };
    await this.requestMvzStats(this._selectedDate);
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
};
</script>

<style>
#table thead tr:first-child th:first-child {
  background-color: white !important;
}

#table th:first-child {
  top: 0;
  z-index: 100 !important;
}

#table td:first-child {
  z-index: 99 !important;
}

#table th:first-child,
#table td:first-child {
  position: sticky !important;
  left: 0;

  background-color: white !important;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.map-td {
  padding: 0 !important;
}
</style>
