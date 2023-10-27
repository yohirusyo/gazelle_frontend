<template>
  <q-page>
    <div class="column fit" style="flex-wrap: nowrap !important;">
      <div class="col col-shrink">
        <div class="row" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)">
          <q-input outlined label="Введите сумму за единицу" class="col" flat dense type="number" v-model="sum"></q-input>
          <q-btn text-color="white" label="Экспорт в excel" icon="las la-file-excel" unelevated
            class="col bg-white text-black border-none" flat no-caps @click="createExcel" />
          <q-btn text-color="white" :label="`с ${_selectedDate?.from} по ${_selectedDate?.to}`" unelevated
            class="col bg-white text-black border-none" flat no-caps>
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="_selectedDate" mask="DD.MM.YYYY" minimal range>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Применить" color="primary" flat @click="requestMvzStats(_selectedDate)" />
                  <q-btn v-close-popup label="Закрыть" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
        </div>
      </div>
      <div class="col">
        <VScrolltable :rows="calculateMvzLimits(sum)
          " :report="false" :columns="columns" rowKey="mvz" id="report-table" />
      </div>
    </div>
  </q-page>
</template>

<script>
import dayjs from "dayjs";
import { mapActions, mapGetters, mapState } from "vuex";
import VScrolltable from "src/components/base/VScrolltable.vue";
import * as XLSX from "xlsx-js-style";

export default {
  name: "report-mvz",
  components: {
    VScrolltable
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
          field: (row) => row.limit.toFixed(2),
          sortable: false,
        },
        {
          name: "limit",
          required: false,
          label: "Стоимость (руб)",
          align: "center",
          field: (row) => row.sum.toFixed(2),
          sortable: false,
        }
      ]
    }
  },
  computed: {
    ...mapState("orderStats", ["mvzStats"]),
    ...mapGetters("orderStats", ["calculateMvzLimits"]),
    calculateMvz() {
      return this.calculateMvzLimits(this.sum)
    }
  },
  methods: {
    ...mapActions("orderStats", [
      "requestMvzStats"
    ]),
    createExcel() {
      const json = this.calculateMvzLimits(this.sum)
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(json);

      var sizes = XLSX.utils.decode_range(ws["!ref"]);

      ws['!cols'] = []
      for (let i = 0; i <= sizes.e.c; i++) {
        ws["!cols"].push({ wch: 22 });
      }

      for (const key of Object.keys(ws)) {
        if (!key.includes("!")) {
          ws[key].s = {
            alignment: {
              horizontal: typeof ws[key].v == "string" ? "left" : "right",
            },
            border: {
              top: { style: 'thin', color: { auto: 1 } },
              bottom: { style: 'thin', color: { auto: 1 } },
              left: { style: 'thin', color: { auto: 1 } },
              right: { style: 'thin', color: { auto: 1 } }
            },
            font: {
              sz: '12'
            }
          };
        }
        if (ws[key].v == "mvz") {
          ws[key].v = "МВЗ",
            ws[key].s = {
              ...ws[key].s,
              alignment: {
                horizontal: "center",
              },
              fill: {
                fgColor: {
                  rgb: "FFDEAD"
                }
              }
            }
        }
        if (ws[key].v == "limit") {
          ws[key].v = "Кол-во (км)",
            ws[key].s = {
              ...ws[key].s,
              alignment: {
                horizontal: "center",
              },
              fill: {
                fgColor: {
                  rgb: "FFDEAD"
                }
              }
            }
        }
        if (ws[key].v == "sum") {
          ws[key].v = "Стоимость (руб)",
            ws[key].s = {
              ...ws[key].s,
              alignment: {
                horizontal: "center",
              },
              fill: {
                fgColor: {
                  rgb: "FFDEAD"
                }
              }
            }
        }
        if (ws[key].v == "null") {
          ws[key].v = "Непривязанные МВЗ"
        }
      }
      XLSX.utils.book_append_sheet(wb, ws, 'Отчет по мвз');
      XLSX.writeFile(wb, `Отчет ${dayjs().format("DD.MM.YYYY HH:mm")}.xlsx`);
    },
  },
  async mounted() {
    this._selectedDate = {
      from: dayjs().format("DD.MM.YYYY"),
      to: dayjs().format("DD.MM.YYYY"),
    };
    await this.requestMvzStats(this._selectedDate)
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
}
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
