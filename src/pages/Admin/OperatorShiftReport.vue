<template>
  <q-page>
    <div class="column fit">
      <div class="col col-shrink">
        <div class="row" style="height: 36px">
          <q-btn
            text-color="white"
            label="Экспорт в excel"
            icon="las la-file-excel"
            unelevated
            class="col bg-white text-black border-none "
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
              <q-date
                v-model="_selectedDate"
                mask="DD.MM.YYYY"
                minimal
                :options="optionsFn"
                range
              >
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    label="Применить"
                    color="primary"
                    flat
                    @click="requestOperatorShiftStats(_selectedDate)"
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
          :rows="getFilteredOperatorShiftStats()"
          :columns="columns"
          row-key="id"
          :report="true"
          id="report-table"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { Loading } from "quasar";
import ISelect from "components/base/ISelect.vue";
import { getexcel } from "src/helpers/excel";
import VScrolltable from "src/components/base/VScrolltable.vue";
export default {
  name: "OperatorShiftReport",
  components: {
    ISelect,
    VScrolltable,
  },
  data() {
    return {
      _selectedDate: null,
      _selectedRow: [],
      height: 0,
      width: 0,
      pagination: {
        rowsPerPage: 0,
      },
      columns: [
        {
          name: "createdAt",
          required: true,
          label: "Дата",
          align: "left",
          field: (row) => row.createdAt,
          format: this.DDMMYYYY,
          sortable: true,
        },
        {
          name: "operatorFullname",
          required: true,
          label: "Диспетчер",
          align: "left",
          sortable: false,
          field: (row) => row.operatorFullname,
        },
        {
          name: "transportNumber",
          required: true,
          label: "ТС",
          align: "left",
          field: (row) => row.transport.transportNumber,
          sortable: true,
        },
        {
          name: "orderQuantity",
          required: true,
          label: "Количество заявок",
          align: "left",
          field: (row) => row.orderQuantity,
          sortable: true,
        },
        {
          name: "summaryBusyTime",
          required: true,
          label: 'Времени в статусе "Занят"',
          align: "left",
          field: (row) => row.summaryBusyTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "summaryNotBusyTime",
          required: true,
          label: 'Времени в статусе "Не занят"',
          align: "left",
          field: (row) => row.summaryNotBusyTime,
          format: this.secondsDuration,
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapState("userStats", ["operatorShiftStats"]),
    ...mapGetters("userStats", [
      "getOperatorShiftMinDate",
      "getOperatorShiftMaxDate",
      "getFilteredOperatorShiftStats",
    ]),
  },
  methods: {
    ...mapActions("userStats", [
      "requestOperatorShiftStats",
      "requestOperatorShiftStatsDates",
    ]),
    dayjs,
    checkNull(val) {
      return val === null || val === undefined;
    },
    secondsDuration(val) {
      if (this.checkNull(val)) val = 0;
      return dayjs
        .utc(dayjs.duration(val, "milliseconds").asMilliseconds())
        .format("HH:mm:ss");
    },
    DDMMYYYY(val) {
      if (this.checkNull(val)) return null;
      return dayjs(val).format("DD.MM.YYYY");
    },
    regular(val) {
      if (this.checkNull(val)) return null;
      return val;
    },
    optionsFn(date) {
      return (
        date >= this.getOperatorShiftMinDate() &&
        date <= this.getOperatorShiftMaxDate()
      );
    },
    createExcel() {
      getexcel(
        document.querySelector("#report-table > div > div > table"),
        "Отчет",
        `(Диспетчеры) Отчет ${dayjs().format("DD.MM.YYYY HH:mm")}`
      );
    },
  },
  async mounted() {
    Loading.show();

    await this.requestOperatorShiftStatsDates();
    this._selectedDate = {
      from: dayjs().format("DD.MM.YYYY"),
      to: dayjs().format("DD.MM.YYYY"),
    };
    await this.requestOperatorShiftStats(this._selectedDate);
    Loading.hide();
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
  /* border */
}
.map-td {
  padding: 0 !important;
}
</style>
