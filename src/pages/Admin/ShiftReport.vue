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
                    @click="requestShiftStats(_selectedDate)"
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
          :rows="getFilteredShiftStats()"
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
import { Loading, Dialog } from "quasar";
import ISelect from "components/base/ISelect.vue";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { getexcel } from "src/helpers/excel";
import VScrolltable from "src/components/base/VScrolltable.vue";
export default {
  name: "ShiftReport",
  components: {
    ISelect,
    VScrolltable,
  },
  data() {
    return {
      _selectedDate: null,
      // _selectedSubdivision: null,
      // _selectedDriverFullname: null,
      // _filterSubdivision: null,
      // _filterDriverFullname: null,
      _selectedRow: [],
      height: 0,
      width: 0,
      pagination: {
        rowsPerPage: 0,
      },
      columns: [
        {
          name: "driverFullname",
          required: true,
          label: "Водитель",
          align: "left",
          field: (row) => row.driverFullname,
          format: this.regular,
          sortable: true,
        },
        {
          name: "transport",
          required: true,
          label: "ТС",
          align: "left",
          sortable: false,
          field: (row) => row.transportNumber,
        },
        {
          name: "startShift",
          required: true,
          label: "Начало смены",
          align: "left",
          field: (row) => row.startShift,
          format: this.HHmm,
          sortable: true,
        },
        {
          name: "endShift",
          required: true,
          label: "Конец смены",
          align: "left",
          field: (row) => row.endShift,
          format: this.HHmmORCurrent,
          sortable: true,
        },
        {
          name: "orderQuantity",
          required: true,
          label: "Количество заявок",
          align: "left",
          field: (row) => row.orderQuantity,
          format: this.regular,
          sortable: true,
        },
        {
          name: "routeLength",
          required: true,
          label: "Пробег по заявкам",
          align: "left",
          field: (row) => row.routeLength,
          format: this.kilometers,
          sortable: true,
        },
        {
          name: "withoutRouteLength",
          required: true,
          label: "Пробег без заявок",
          align: "left",
          field: (row) => row.withoutRouteLength,
          format: this.kilometers,
          sortable: true,
        },
        {
          name: "summaryTimeBeforeAccepted",
          required: true,
          label: "Суммарное время до принятия заявки",
          align: "left",
          field: (row) => row.summaryTimeBeforeAccepted,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "summaryTimeEntryToCustomer",
          required: true,
          label: "Суммарное время до прибытия к заказчику",
          align: "left",
          field: (row) => row.summaryTimeEntryToCustomer,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "summaryLoadingTime",
          required: true,
          label: "Суммарное время загрузки",
          align: "left",
          field: (row) => row.summaryLoadingTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "summaryDriveTime",
          required: true,
          label: "Суммарное время в движении",
          align: "left",
          field: (row) => row.summaryDriveTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "summaryUnloadingTime",
          required: true,
          label: "Суммарное время разгрузки",
          align: "left",
          field: (row) => row.summaryUnloadingTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "summaryLoadingWaitingTime",
          required: true,
          label: "Суммарное время ожидания погрузки",
          align: "left",
          field: (row) => row.summaryLoadingWaitingTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "summaryAfterLoadingWaitingTime",
          required: true,
          label: "Суммарное время ожидания разгрузки",
          align: "left",
          field: (row) => row.summaryAfterLoadingWaitingTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "summaryUnloadingWaiting",
          required: true,
          label: "Суммарное время разгрузки",
          align: "left",
          field: (row) => row.summaryUnloadingWaiting,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "freeTime",
          required: true,
          label: "Суммарное время без заявок",
          align: "left",
          field: (row) => row.freeTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "summaryAll",
          required: true,
          label: "Суммарное время по заявкам",
          align: "left",
          field: (row) => row.summaryAll,
          format: this.secondsDuration,
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapState("userStats", ["shiftStats"]),
    ...mapGetters("userStats", [
      "getShiftMinDate",
      "getShiftMaxDate",
      "getFilteredShiftStats",
      // "statsSubidivisions",
      // "driversFullnames",
    ]),
    ...mapGetters("user", ["getDriverById"]),
    ...mapGetters("transport", ["getTransportById"]),
  },
  methods: {
    ...mapActions("userStats", ["requestShiftStats", "requestShiftStatsDates"]),
    dayjs,
    // async openMap(order) {
    //   Dialog.create({
    //     component: MapOrder,
    //     componentProps: {
    //       order,
    //     },
    //   });
    // },
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
    HHmm(val) {
      if (this.checkNull(val)) return null;
      return dayjs(val).format("HH:mm");
    },
    HHmmORCurrent(val) {
      if (val) return this.HHmm(val);
      return "н.в.";
    },
    kilometers(val) {
      if (val == null) return null;
      return `${(val / 1000).toFixed(1)} км.`;
    },
    kilometersWithoutKM(val) {
      if (val == null) return null;
      return `${(val / 1000).toFixed(1)}`.replace(".", ",");
    },
    regular(val) {
      if (this.checkNull(val)) return null;
      return val;
    },
    operator(val) {
      if (val.order.isRequest) return val.order.customer.subdivision;
      return val.operatorFullname;
    },
    optionsFn(date) {
      return date >= this.getShiftMinDate() && date <= this.getShiftMaxDate();
    },
    createExcel() {
      getexcel(
        document.querySelector("#report-table > div > div > table"),
        "Отчет",
        `(Смены) Отчет ${dayjs().format("DD.MM.YYYY HH:mm")}`
      );
    },
  },
  async mounted() {
    Loading.show();

    await this.requestShiftStatsDates();
    this._selectedDate = {
      from: dayjs().format("DD.MM.YYYY"),
      to: dayjs().format("DD.MM.YYYY"),
    };
    await this.requestShiftStats(this._selectedDate);
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
