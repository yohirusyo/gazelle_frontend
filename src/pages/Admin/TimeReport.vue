<template>
    <q-page>
        <div class="column fit" style="flex-wrap: nowrap !important">
            {{ dayDriverShift }}
            <div class="col col-shrink">
                <div class="row" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)">
                    <q-btn text-color="white" label="Экспорт в exel" icon="las la-file-exel" unelevated
                        class="col bg-white text-black border-none" flat no-caps @click="createExel" />
                    <q-separator vertical />
                    <q-btn :disabled="_activeOrder" text-color="white"
                        :label="`с ${_selectedDate?.from} по ${_selectedDate?.to}`" unelevated
                        class="col bg-white text-black border-none" flat no-caps>
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-date v-model="_selectedDate" mask="DD.MM.YYYY" minimal range>
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Применить" color="primary" flat
                                        @click="requestDayDriverShiftWithLoading()" />
                                    <q-btn v-close-popup label="Закрыть" color="primary" flat />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-btn>
                    <q-separator vertical />
                </div>
            </div>
            <q-table separator="cell" flat dense :rows="timeStats" :columns="columns" id="report-table"
                :rows-per-page-options="[0]" hide-bottom />
        </div>
    </q-page>
</template>

<script>
import dayjs from 'dayjs';
import { mapActions, mapState } from 'vuex';
import * as XLSX from "xlsx-js-style";
import { Loading } from "quasar";

export default {
    name: "report-time",
    data() {
        return {
            _selectedDate: null,
            columns: [
                {
                    name: "date",
                    required: false,
                    label: "Дата",
                    align: "center",
                    // fields: (row) => row.date, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "vis",
                    required: false,
                    label: "ВИС",
                    align: "center",
                    // fields: (row) => row.vis, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "gazOpen",
                    required: false,
                    label: "Газель открытая",
                    align: "center",
                    // fields: (row) => row.gazOpen, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "gazTent",
                    required: false,
                    label: "Газель тентованная",
                    align: "center",
                    // fields: (row) => row.gazTent, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "gazFur",
                    required: false,
                    label: "Газель фургон",
                    align: "center",
                    // fields: (row) => row.gazFur, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "bort5",
                    required: false,
                    label: "Бортовой 5т",
                    align: "center",
                    // fields: (row) => row.bort5, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "bort5opg",
                    required: false,
                    label: "Бортовой 5т ОПГ",
                    align: "center",
                    // fields: (row) => row.bort5opg, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "bort10",
                    required: false,
                    label: "Бортовой 10т",
                    align: "center",
                    // fields: (row) => row.bort10, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "sam13tNoBort",
                    required: false,
                    label: "Самосвал 13т без борта",
                    align: "center",
                    // fields: (row) => row.sam13tNoBort, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "sam15tNoBort",
                    required: false,
                    label: "Самосвал 15т без борта",
                    align: "center",
                    // fields: (row) => row.sam15tNoBort, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "sam20tNoBort",
                    required: false,
                    label: "Самосвал 20т без борта",
                    align: "center",
                    // fields: (row) => row.sam20tNoBort, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "sam15tWithBort",
                    required: false,
                    label: "Самосвал 15т с бортом",
                    align: "center",
                    // fields: (row) => row.sam15tWithBort, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "sam20tWithBort",
                    required: false,
                    label: "Самосвал 20т с бортом",
                    align: "center",
                    // fields: (row) => row.sam20tWithBort, summaryOnTransportType
                    sortable: false,
                },
                {
                    name: "SedTag",
                    required: false,
                    label: "Седельный тягач",
                    align: "center",
                    // fields: (row) => row.SedTag,
                    sortable: false,
                },
                {
                    name: "Bort15tLong",
                    required: false,
                    label: "Бортовой 15т удлиненный",
                    align: "center",
                    // fields: (row) => row.Bort15tLong, summaryOnTransportType
                    sortable: false,
                },
            ]
        }
    },

    methods: {
        ...mapActions("userStats", ["requestDayDriverShift"]),
        LabelDDMMYYYY(val) {
            return dayjs(val, "DD.MM.YYYY HH:mm").format("DD.MM.YYYY")
        },
        LabelHHmm(val) {
            return dayjs(val, "DD.MM.YYYY HH:mm").format("HH:mm");
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
        }
    },

    computed: {
        ...mapState("userStats", ["dayDriverShift"])
    },
    async mounted() {
        this._selectedDate = {
            from: dayjs(dayjs()).subtract(1, 'weeks').format("DD.MM.YYYY"),
            to: dayjs(dayjs()).format("DD.MM.YYYY"),
        };
        this.requestDayDriverShiftWithLoading()
    },
    watch: {
        _selectedDate() {
            if (typeof this._selectedDate == 'string') {
                this._selectedDate = {
                    from: dayjs(this._selectedDate, "DD.MM.YYYY HH:mm").startOf("day").format("DD.MM.YYYY HH:mm"),
                    to: dayjs(this._selectedDate, "DD.MM.YYYY HH:mm").endOf("day").format("DD.MM.YYYY HH:mm"),
                }
            }
        }
    }

}
</script>