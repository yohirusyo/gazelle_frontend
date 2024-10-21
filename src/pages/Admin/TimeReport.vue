<template>
    <q-page>
        <div class="row">
            <q-btn text-color="white" label="Экспорт в excel" icon="las la-file-excel" unelevated
                class="col bg-white text-black border-none " flat no-caps @click="createExcel" />
            <q-select :options="limitMonths" v-model="_selectedMonth" label="Месяц" square outlined dense
                @update:model-value="(val) => updateData(val)" :option-label="(item) => monthLabel(item)"
                class="col bg-white text-black border-none" />
        </div>
        <div class="column fit" style="flex-wrap: nowrap !important">
            <table id="report-table">
                <tr>
                    <th style="display: none;"></th>
                    <th>Дата</th>
                    <th v-for="d of dayDriverShift" :key="index">{{ d.transportType }}</th>
                </tr>
                <tr v-for="(date, index) of dayDriverShift[0]?.dates.length" :key="index">
                    <td style="display: none;"></td>
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
import { getexcel } from "src/helpers/excel";
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
                from: dayjs(new Date(item.year, item.month + 1, 0), "DD.MM.YYYY HH:mm").startOf('month').format("DD.MM.YYYY HH:mm"),
                to: dayjs(new Date(item.year, item.month + 1, 0), "DD.MM.YYYY HH:mm").endOf('month').format("DD.MM.YYYY HH:mm")
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
        createExcel() {
            getexcel(
                document.querySelector("#report-table"),
                "Отчет по времени под заявкой",
                `Отчет ${dayjs().format("DD.MM.YYYY HH:mm")}`
            );
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