<template>
    <q-page>
        <q-select :options="limitMonths" v-model="_selectedMonth" label="Месяц" square outlined dense
                @update:model-value="(val) => updateData(val)" :option-label="(item) => monthLabel(item)"
                class="col text-black border-none" />
        <div class="column fit" style="flex-wrap: nowrap !important">
            <table>
                <tr>
                    <th>Дата</th>
                    <th v-for="d of dayDriverShift" :key="index">{{ d.transportType }}</th>
                </tr>
                <tr v-for="(date, index) of dayDriverShift[0]?.dates.length" :key="index">
                    <td>{{ dayjs(dayDriverShift[0]?.dates[index].date).locale("ru").format("D MMM, dddd") }}</td>
                    <td v-for="d of dayDriverShift" :key="d.transportType">
                        {{ Math.round(d.dates[index]?.percentageOnOrder * 100) / 100 }}</td>
                </tr>
            </table>
        </div>
    </q-page>
</template>

<script>
import dayjs from 'dayjs';
import objectSupport from "dayjs/plugin/objectSupport";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { mapActions, mapState } from 'vuex';
import * as XLSX from "xlsx-js-style";
import { Loading } from "quasar";
import _ from "lodash";
dayjs.extend(localizedFormat);
dayjs.extend(objectSupport);

export default {
    name: "report-time",
    data() {
        return {
            _selectedDate: null,
            _selectedMonth: null,
        }
    },

    methods: {
        ...mapActions("userStats", ["requestDayDriverShift"]),
        ...mapActions("limit", ["getAllControlLimits"]),
        LabelDDMMYYYY(val) {
            return dayjs(val, "DD.MM.YYYY HH:mm").format("DD.MM.YYYY")
        },
        LabelHHmm(val) {
            return dayjs(val, "DD.MM.YYYY HH:mm").format("HH:mm");
        },
        updateData(item) {
            this._selectedDate = {
                from: dayjs(new Date(item.year, item.month+1, 0), "DD.MM.YYYY HH:mm").startOf('month').format("DD.MM.YYYY HH:mm"),
                to: dayjs(new Date(item.year, item.month+1, 0), "DD.MM.YYYY HH:mm").endOf('month').format("DD.MM.YYYY HH:mm")
            };
            this.requestDayDriverShiftWithLoading()
        },
        monthLabel(item) {
            return _.capitalize(
                dayjs({ year: item.year, month: item.month })
                    .locale("ru")
                    .format("MMMM YYYY")
            );
        },
        createExel() {
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

            for (let i = 1; i <= this.timeStats.length + 1; i++) {
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

            ws["!ref"] = `A1:H${this.timeStats.length + 1}`;
            ws["!fullref"] = `A1:H${this.timeStats.length + 1}`;

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Отчет по подразделеням");
            XLSX.writeFile(wb, `Отчет ${dayjs().format("DD.MM.YYYY HH:mm")}.xlsx`);
        },
        async requestDayDriverShiftWithLoading() {
            Loading.show()
            await this.requestDayDriverShift(this._selectedDate);
            Loading.hide()
        },
        dayjs
    },

    computed: {
        ...mapState("userStats", ["dayDriverShift"]),
        ...mapState("limit", ["controlLimits"]),
        limitMonths: {
            get() {
                return this.controlLimits;
            },
        },
    },
    async mounted() {
        this._selectedDate = {
            from: dayjs(dayjs()).startOf('month').format("DD.MM.YYYY"),
            to: dayjs(dayjs()).endOf('month').format("DD.MM.YYYY"),
        };
        this.requestDayDriverShiftWithLoading()
        this.getAllControlLimits();
    },
    watch: {

    }

}
</script>

<style scoped>
TABLE {
    border-collapse: collapse;
}

TD,
TH {
    padding: 3px;
    border: 1px solid black;
}

TH {
    background: #a2bcb3;
}
</style>