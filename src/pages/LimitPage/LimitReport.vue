<template>
  <div>
    <q-input
      :label="firstPeriod"
      class="col text-black border-none q-pa-sm"
      square
      outlined
      dense
      hide-bottom-space
      hide-hint
      readonly
    >
      <template v-slot:after>
        <q-btn
          :disable="!checkFormatPropsDate15"
          flat
          dense
          :text-color="checkFormatPropsDate15 ? 'primary' : 'black'"
          size="lg"
          icon="download"
          @click="getReport(0)"
        >
          <q-tooltip>Отчет по номерам машин</q-tooltip>
        </q-btn>
        <q-btn
          :disable="!checkFormatPropsDate15"
          dense
          flat
          :text-color="checkFormatPropsDate15 ? 'primary' : 'black'"
          size="lg"
          icon="download"
          @click="getReport(0, true)"
        >
          <q-tooltip>Отчет по МВЗ машин</q-tooltip>
        </q-btn>
      </template>
    </q-input>
    <q-input
      :label="secondPeriod"
      class="col text-black border-none q-pa-sm"
      square
      outlined
      dense
      hide-bottom-space
      hide-hint
      readonly
    >
      <template v-slot:after>
        <q-btn
          :disable="!checkFormatPropsDate20"
          flat
          dense
          :text-color="checkFormatPropsDate20 ? 'primary' : 'black'"
          size="lg"
          icon="download"
          @click="getReport(1)"
        >
          <q-tooltip>Отчет по номерам машин</q-tooltip>
        </q-btn>
        <q-btn
          :disable="!checkFormatPropsDate20"
          dense
          flat
          :text-color="checkFormatPropsDate20 ? 'primary' : 'black'"
          size="lg"
          icon="download"
          @click="getReport(1, true)"
        >
          <q-tooltip>Отчет по МВЗ машин</q-tooltip>
        </q-btn>
      </template>
    </q-input>
    <q-input
      :label="thirdPeriod"
      class="col text-black border-none q-pa-sm"
      square
      outlined
      dense
      hide-bottom-space
      hide-hint
      readonly
    >
      <template v-slot:after>
        <q-btn
          :disable="!checkFormatPropsDate30"
          flat
          dense
          :text-color="checkFormatPropsDate30 ? 'primary' : 'black'"
          size="lg"
          icon="download"
          @click="getReport(2)"
        >
          <q-tooltip>Отчет по номерам машин</q-tooltip>
        </q-btn>
        <q-btn
          :disable="!checkFormatPropsDate30"
          dense
          flat
          :text-color="checkFormatPropsDate30 ? 'primary' : 'black'"
          size="lg"
          icon="download"
          @click="getReport(2, true)"
        >
          <q-tooltip>Отчет по МВЗ машин</q-tooltip>
        </q-btn>
      </template>
    </q-input>
    <table
      class="text-center"
      ref="export"
      style="border-collapse: collapse; display: none"
    >
      <tr class="text-center">
        <td>
          Счет-реестр автоуслуг по управлению снабжения за период {{ _period }}
        </td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Заказчик:</td>
        <td></td>
        <td>ММК-МЕТИЗ ОАО</td>
        <td></td>
      </tr>
      <tr>
        <td>Подрядчик:</td>
        <td></td>
        <td>АТУ ООО</td>
        <td></td>
      </tr>
      <tr>
        <td>Дата</td>
        <td>{{ "ТС" }}</td>
        <td>КМ</td>
        <td>Руб</td>
      </tr>
      <tr v-for="item of statsControl" :key="item.id">
        <td>{{ item.orderTime }}</td>
        <td>
          {{ item.stats.transportNumber }}
        </td>
        <td>{{ item.routeLength }}</td>
        <td>{{ (item.routeLength * cost).toFixed(2) }}</td>
      </tr>
      <tr>
        <td>Общий итог</td>
        <td></td>
        <td>{{ totalRouteLength.toFixed(2) }}</td>
        <td>{{ (totalRouteLength * cost).toFixed(2) }}</td>
      </tr>
    </table>
    <table
      class="text-center"
      ref="exportmvz"
      style="border-collapse: collapse; display: none"
    >
      <tr class="text-center">
        <td>
          Счет-реестр автоуслуг по управлению снабжения за период  {{ _period }}
        </td>
        <td></td>
      </tr>
      <tr>
        <td>МВЗ</td>
        <td>Руб</td>
      </tr>
      <tr v-for="item of statsControl" :key="item.id">
        <td>
          {{ item.transport.mvz }}
        </td>
        <td>{{ (item.routeLength * cost).toFixed(2) }}</td>
      </tr>
      <tr>
        <td>Общий итог</td>
        <td>{{ (totalRouteLength * cost).toFixed(2) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import * as XLSX from "xlsx-js-style";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default {
  name: "LimitReport",
  props: ["year", "month", "cost"],
  data() {
    return {
      _period: null,
      first: null,
      second: null,
      third: null,
    };
  },

  watch: {
    month: {
      async handler(newVal, oldVal) {
        await this.getStatsContorlLimits({
          period: 0,
          year: this.year,
          month: this.month,
        });
        this.first = this.statsControl;
        if (this.checkFormatPropsDate15) {
          await this.getStatsContorlLimits({
            period: 1,
            year: this.year,
            month: this.month,
          });
          this.second = this.statsControl;
        } else this.second = null;
        if (this.checkFormatPropsDate20) {
          await this.getStatsContorlLimits({
            period: 2,
            year: this.year,
            month: this.month,
          });
          this.third = this.statsControl;
        } else this.third = null;
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState("limit", ["statsControl"]),
    monthLabel: {
      get() {
        return this.month >= 9 ? this.month + 1 : "0" + (this.month + 1);
      },
    },
    firstPeriod: {
      get() {
        return `c 01.${this.monthLabel}.${this.year} по 14.${this.monthLabel}.${
          this.year
        } / ${this.firstPeriodRouteLength?.toFixed(2)} км / ${(
          this.firstPeriodRouteLength * this.cost
        )?.toFixed(2)} руб.`;
      },
    },
    secondPeriod: {
      get() {
        return `c 15.${this.monthLabel}.${this.year} по 20.${this.monthLabel}.${
          this.year
        } / ${this.secondPeriodRouteLength?.toFixed(2)} км / ${(
          this.secondPeriodRouteLength * this.cost
        )?.toFixed(2)} руб.`;
      },
    },
    thirdPeriod: {
      get() {
        return `c 21.${this.monthLabel}.${
          this.year
        } по последнее число месяца / ${this.thirdPeriodRouteLength?.toFixed(
          2
        )} км / ${(this.thirdPeriodRouteLength * this.cost)?.toFixed(2)} руб.`;
      },
    },

    totalRouteLength: {
      get() {
        return this.statsControl.reduce((sum, item) => {
          if (item.routeLength !== null) {
            return sum + Number(item.routeLength);
          } else {
            return sum;
          }
        }, 0);
      },
    },
    firstPeriodRouteLength: {
      get() {
        return this.first?.reduce((sum, item) => {
          if (item.routeLength !== null) {
            return sum + Number(item.routeLength);
          } else {
            return sum;
          }
        }, 0);
      },
    },
    secondPeriodRouteLength: {
      get() {
        return this.second == null
          ? 0
          : this.second?.reduce((sum, item) => {
              if (item.routeLength !== null) {
                return sum + Number(item.routeLength);
              } else {
                return sum;
              }
            }, 0);
      },
    },
    thirdPeriodRouteLength: {
      get() {
        return this.third == null
          ? 0
          : this.third?.reduce((sum, item) => {
              if (item.routeLength !== null) {
                return sum + Number(item.routeLength);
              } else {
                return sum;
              }
            }, 0);
      },
    },
    checkFormatPropsDate15: {
      get() {
        return dayjs().format("YYYYMMDDHHmm") >= this.formatPropsDate15();
      },
    },
    checkFormatPropsDate20: {
      get() {
        return dayjs().format("YYYYMMDDHHmm") >= this.formatPropsDate20();
      },
    },
    checkFormatPropsDate30: {
      get() {
        return dayjs().format("YYYYMMDDHHmm") >= this.formatPropsDate30();
      },
    },
  },

  methods: {
    ...mapActions("limit", ["getStatsContorlLimits"]),
    formatPropsDate15() {
      return dayjs({
        year: this.year,
        month: this.month,
        date: 14,
        hours: 19,
        minutes: 30,
      }).format("YYYYMMDDHHmm");
    },
    formatPropsDate20() {
      return dayjs({
        year: this.year,
        month: this.month,
        date: 20,
        hours: 19,
        hours: 19,
        minutes: 30,
      }).format("YYYYMMDDHHmm");
    },
    formatPropsDate30() {
      return dayjs({
        year: this.year,
        month: this.month,
      })
        .endOf("month")
        .format("YYYYMMDDHHmm");
    },


    async getReport(period, mvz = false) {
      period == 0
        ? (this._period = `c 01.${this.monthLabel}.${this.year} по 14.${this.monthLabel}.${this.year}`)
        : period == 1
        ? (this._period = `c 15.${this.monthLabel}.${this.year} по 20.${this.monthLabel}.${this.year}`)
        : (this._period = `c 21.${this.monthLabel}.${this.year} по последнее число месяца`);
      await this.getStatsContorlLimits({
        period: period,
        year: this.year,
        month: this.month,
        mvz: mvz,
      });
      mvz ? this.createExcelMvz() : this.createExcel()
    },

    createExcelMvz(){
      const excel = this.$refs.exportmvz
      const ws = XLSX.utils.table_to_sheet(excel, { raw: true });

      ws["!cols"] = [{wch: 24}, {wch: 24}]
      
      ws['!merges'] = [ { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }]

      ws["!rows"] = [
        {
          hpt: 30,
        },
      ];      

      const border = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      };

      for (const key of Object.keys(ws)) {
        if (!key.includes("!")) {
          ws[key].s = {
            border,
            alignment: {
              horizontal: "center",
              wrapText: true,
              vertical: "center",
            },
          };
        }
      }
      
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Отчет по МВЗ ТС");

      XLSX.writeFile(wb, `Отчет по МВЗ ТС ${dayjs().format("DD.MM.YYYY HH:mm")}.xlsx`);
    },
    createExcel() {
      let excel = this.$refs.export;
      const ws = XLSX.utils.table_to_sheet(excel, { raw: true });

      const border = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      };

      // // Определение ширины ячекеек
      ws["!cols"] = [{ wch: 24 }, { wch: 24 }, { wch: 24 }, { wch: 24 }];
      // Формирование шапки
      const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
        { s: { r: 1, c: 2 }, e: { r: 1, c: 3 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
        { s: { r: 2, c: 2 }, e: { r: 2, c: 3 } },
      ];

      if (!ws["!merges"]) ws["!merges"] = [];
      merges.forEach(function (merge) {
        ws["!merges"].push(merge);
      });

      const cells1 = [
        "A1",
        "B1",
        "C1",
        "D1",
        "A2",
        "B2",
        "C2",
        "D2",
        "A3",
        "B3",
        "C3",
        "D3",
        "A4",
        "B4",
        "C4",
        "D4",
      ];
      cells1.forEach((cell) => {
        (ws[cell].s = {
          border,
          alignment: {
            horizontal: "center",
          },
        }),
          (ws[cell].t = "s");
      });
      // Формирование основной таблицы
      const startingCells = ["A5", "B5", "C5", "D5"]; // Начальные точки

      const cellCount = this.statsControl.length; // Количество заявок (без итого)

      const cells2 = startingCells.flatMap((startingCell) => {
        const [startColumn, startRow] = startingCell.match(/[A-Z]+|[0-9]+/g); // Деления ячейки на букву и число
        return Array.from({ length: cellCount }, (_, index) => {
          const nextRow = parseInt(startRow) + index;
          return `${startColumn}${nextRow}`;
        });
      });

      cells2.forEach((cell) => {
        if (Object.keys(ws).includes(cell)) {
          (ws[cell].s = {
            border: border,
            alignment: {
              horizontal: "center",
            },
          }),
            (ws[cell].t = "s");
        }
      });
      // Формирование итого
      const lastNumberFromCells = parseInt(cells2[cells2.length - 1].slice(1));
      const cells3 = [
        `A${lastNumberFromCells + 1}`,
        `B${lastNumberFromCells + 1}`,
        `C${lastNumberFromCells + 1}`,
        `D${lastNumberFromCells + 1}`,
      ];
      const merges1 = {
        s: { r: lastNumberFromCells, c: 0 },
        e: { r: lastNumberFromCells, c: 1 },
      };
      ws["!merges"].push(merges1);
      cells3.forEach((cell) => {
        (ws[cell].s = {
          border,
          alignment: {
            horizontal: "center",
          },
        }),
          (ws[cell].t = "s");
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Счет-реестр автоуслуг по УС");

      XLSX.writeFile(wb, `Отчет ${dayjs().format("DD.MM.YYYY HH:mm")}.xlsx`);
    },
  },
};
</script>

<style>
.q-field--outlined.q-field--readonly .q-field__control:before {
  border-style: solid;
  border: 1px solid black;
}
</style>
