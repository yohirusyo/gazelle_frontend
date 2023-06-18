<template>
  <q-page>
    <div class="column fit">
      <div class="col col-shrink">
        <div class="row">
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
          <ISelect
            :options="statsSubidivisions"
            v-model="_selectedSubdivision"
            :labelFn="(item) => item"
            label="Подразделение"
            @selected="(val) => (_selectedSubdivision = val)"
            class="col text-black border-none"
          />
          <ISelect
            :options="driversFullnames"
            v-model="_selectedDriverFullname"
            :labelFn="(item) => item"
            label="Ф.И.О. водителя"
            @selected="(val) => (_selectedDriverFullname = val)"
            class="col text-black border-none"
            flat
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
                    @click="requestOrderStats(_selectedDate)"
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
          :rows="
            getFilteredStats(_selectedDriverFullname, _selectedSubdivision)
          "
          :columns="columns"
          rowKey="orderId"
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
import { Loading, Dialog } from "quasar";
import ISelect from "components/base/ISelect.vue";
import MapOrder from "components/report/Map.vue";
import { getexcel } from "src/helpers/excel";
import VScrolltable from "src/components/base/VScrolltable.vue";
export default {
  name: "Report",
  components: {
    ISelect,
    VScrolltable,
  },
  data() {
    return {
      _selectedDate: null,
      _selectedSubdivision: null,
      _selectedDriverFullname: null,
      _filterSubdivision: null,
      _filterDriverFullname: null,
      _selectedRow: [],
      height: 0,
      width: 0,
      pagination: {
        rowsPerPage: 0,
      },
      columns: [
        {
          name: "orderId",
          required: true,
          label: "Номер заказа",
          align: "left",
          field: (row) => row.orderId,
          format: this.regular,
          sortable: true,
        },
        {
          name: "date",
          required: true,
          label: "Дата",
          align: "left",
          field: (row) => row.order.orderTime,
          format: this.DDMMYYYY,
          sortable: true,
        },
        {
          name: "customerSubdivision",
          required: true,
          label: "Подразделение (отв.)",
          align: "left",
          field: (row) => row.order.customer.subdivision,
          format: this.regular,
          sortable: true,
        },
        {
          name: "customerFullname",
          required: true,
          label: "Ответственный",
          align: "left",
          field: (row) => row.order.customer.fullname,
          format: this.regular,
          sortable: true,
        },
        // {
        //   name: "customerPhoneNumber",
        //   required: true,
        //   label: "Телефон (отв.)",
        //   align: "left",
        //   field: (row) => row.order.customer.phoneNumber,
        //   format: this.regular,
        //   sortable: true,
        // },
        {
          name: "routeLength",
          required: false,
          label: "Расстояние",
          align: "right",
          field: (row) =>
            row.order.routeLength != null && row.order.routeLength != 0
              ? `${(row.order.routeLength / 1000).toFixed(1)}км`
              : null,
          sortable: true,
        },
        {
          name: "departurePoint",
          required: true,
          label: "Место отправления",
          align: "left",
          field: (row) => row.order.departurePoint.name,
          format: this.regular,
          sortable: true,
        },
        {
          name: "destination",
          required: true,
          label: "Место назначения",
          align: "left",
          field: (row) => row.order.destination.name,
          format: this.regular,
          sortable: true,
        },
        {
          name: "transportType",
          required: true,
          label: "Тип траспорта",
          align: "left",
          field: (row) => row.transportType,
          format: this.regular,
          sortable: true,
        },
        {
          name: "transportNumber",
          required: true,
          label: "Номер",
          align: "left",
          field: (row) => row.transportNumber,
          format: this.regular,
          sortable: true,
        },
        {
          name: "driverFullname",
          required: true,
          label: "Водитель",
          align: "left",
          field: (row) => row.driverFullname,
          format: this.regular,
          sortable: true,
        },
        // {
        //   name: "driverPhoneNumber",
        //   required: true,
        //   label: "Телефон",
        //   align: "left",
        //   field: (row) => row.driverPhoneNumber,
        //   format: this.regular,
        //   sortable: true,
        // },
        {
          name: "orderedAt",
          required: true,
          label: "Время заказа",
          align: "left",
          field: (row) => row.order.orderedAt,
          format: this.HHmm,
          sortable: true,
        },
        {
          name: "orderTime",
          required: true,
          label: "Время подачи ( плановое )",
          align: "left",
          field: (row) => row.order.orderTime,
          format: this.HHmm,
          sortable: true,
        },
        {
          name: "accepted",
          required: true,
          label: "Время принятия заявки водителем",
          align: "left",
          field: (row) => row.acceptedAt,
          format: this.HHmm,
          sortable: true,
        },
        {
          name: "entryToCustomer",
          required: true,
          label: "Время подачи ( фактическое )",
          align: "left",
          field: (row) => row.entryToCustomerFact,
          format: this.HHmm,
          sortable: true,
        },
        {
          name: "loadingStartFact",
          required: true,
          label: "Время начала погрузки",
          align: "left",
          field: (row) => row.loadingStartFact,
          format: this.HHmm,
          sortable: true,
        },
        {
          name: "loadingEndFact",
          required: true,
          label: "Время окончания погрузки",
          align: "left",
          field: (row) => row.loadingEndFact,
          format: this.HHmm,
          sortable: true,
        },
        {
          name: "exitToDestination",
          required: true,
          label: "Время убытия в место назначения",
          align: "left",
          field: (row) => row.exitToDestinationFact,
          format: this.HHmm,
          sortable: true,
        },
        {
          name: "exitToDestination",
          required: true,
          label: "Время прибытия в место назначения",
          align: "left",
          field: (row) => row.exitToDestinationFact,
          format: this.HHmm,
          sortable: true,
        },
        {
          name: "unloadingStartFact",
          required: true,
          label: "Время начала разгрузки",
          align: "left",
          field: (row) => row.unloadingStartFact,
          format: this.HHmm,
          sortable: true,
        },
        {
          name: "doneAt",
          required: true,
          label: "Время окончания заказа",
          align: "left",
          field: (row) => row.doneAt,
          format: this.HHmm,
          sortable: true,
        },
        {
          name: "timeBetweenOrders",
          required: true,
          label: "Время между заказами",
          align: "left",
          field: (row) => row.timeBetweenOrders,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "timeBeforeAccepted",
          required: true,
          label: "Время до принятия заявки",
          align: "left",
          field: (row) => row.timeBeforeAccepted,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "timeEntryToCustomer",
          required: true,
          label: "Время до прибытия к заказчику",
          align: "left",
          field: (row) => row.timeEntryToCustomer,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "loadingWaitingTime",
          required: true,
          label: "Время ожидания погрузки",
          align: "left",
          field: (row) => row.loadingWaitingTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "loadingTime",
          required: true,
          label: "Время погрузки",
          align: "left",
          field: (row) => row.loadingTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "afterLoadingWaitingTime",
          required: true,
          label: "Время ожидания после погрузки",
          align: "left",
          field: (row) => row.afterLoadingWaitingTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "driveTime",
          required: true,
          label: "Время в движении",
          align: "left",
          field: (row) => row.driveTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "unloadingWaiting",
          required: true,
          label: "Время ожидания разгрузки",
          align: "left",
          field: (row) => row.unloadingWaiting,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "unloadingTime",
          required: true,
          label: "Время разгрузки",
          align: "left",
          field: (row) => row.unloadingTime,
          format: this.secondsDuration,
          sortable: true,
        },
        {
          name: "name",
          required: true,
          label: "Наименование груза",
          align: "left",
          field: (row) => row.order.name,
          format: this.regular,
          sortable: true,
        },
        {
          name: "descriptiom",
          required: true,
          label: "Комментарий",
          align: "left",
          field: (row) => row.order.description,
          format: this.regular,
          sortable: true,
        },
        {
          name: "passengerCount",
          required: true,
          label: "Кол-во пассажиров",
          align: "left",
          field: (row) => row.order.passengerCount,
          format: this.regular,
          sortable: true,
        },
        {
          name: "weight",
          required: true,
          label: "Вес",
          align: "left",
          field: (row) => row.order.weight,
          format: this.regular,
          sortable: true,
        },
        {
          name: "length",
          required: true,
          label: "Длина",
          align: "left",
          field: (row) => row.order.length,
          format: this.regular,
          sortable: true,
        },
        {
          name: "width",
          required: true,
          label: "Ширина",
          align: "left",
          field: (row) => row.order.width,
          format: this.regular,
          sortable: true,
        },
        {
          name: "height",
          required: true,
          label: "Высота",
          align: "left",
          field: (row) => row.order.height,
          format: this.regular,
          sortable: true,
        },
        {
          name: "contactFullname",
          required: true,
          label: "Контактное лицо",
          align: "left",
          field: (row) => row.order.contact?.fullname,
          format: this.regular,
          sortable: true,
        },
        // {
        //   name: "contactPhoneNumber",
        //   required: true,
        //   label: "Телефон",
        //   align: "left",
        //   field: (row) => row.order.contact?.phoneNumber,
        //   format: this.regular,
        //   sortable: true,
        // },
        {
          name: "placeName",
          required: true,
          label: "Место получения текущей заявки",
          align: "left",
          field: (row) => (row.place ? row.place.name : "-"),
          format: this.regular,
          sortable: true,
        },
        {
          name: "operatorFullname",
          required: true,
          label: "Диспетчер",
          align: "left",
          field: (row) => row,
          format: this.operator,
          sortable: true,
        },
        {
          name: "isDeleted",
          required: true,
          label: "Статус",
          align: "left",
          field: (row) => row,
          format: (val) =>
            val.isDeleted || val.order.isDeleted
              ? `Удален / ${val.deletedByFullname}`
              : val.order.isRequest && val.order.isDeclined
              ? `Отклонен / ${val.deletedByFullname}`
              : "Завершен" /* (!val ? "Завершен" : "Удален") */,
          sortable: true,
        },
        {
          name: "cargoRecieverSubdivision",
          required: true,
          label: "Подразделение (груз.)",
          align: "left",
          field: (row) => row.order.cargoReciever?.subdivision,
          format: this.regular,
          sortable: true,
        },
        {
          name: "cargoRecieverFullname",
          required: true,
          label: "Грузополучатель",
          align: "left",
          field: (row) => row.order.cargoReciever?.fullname,
          format: this.regular,
          sortable: true,
        },
        {
          name: "isEmergency",
          required: true,
          label: "Аварийная",
          align: "left",
          field: (row) => row.order.isEmergency,
          format: this.boolean,
          sortable: true,
        },

        // {
        //   name: "cargoRecieverPhoneNumber",
        //   required: true,
        //   label: "Телефон (груз.)",
        //   align: "left",
        //   field: (row) => row.order.cargoReciever?.phoneNumber,
        //   format: this.regular,
        //   sortable: true,
        // },
        {
          name: "cargoSenderLimit",
          required: true,
          label: "Лимит грузоотправителя",
          align: "left",
          field: (row) => row.cargoSenderLimit,
          format: this.regular,
          sortable: true,
        },
        {
          name: "cargoRecieverLimit",
          required: true,
          label: "Лимит грузополучателя",
          align: "left",
          field: (row) => row.cargoRecieverLimit,
          format: this.regular,
          sortable: true,
        },

        ////////////////////////////
      ],
    };
  },
  computed: {
    ...mapState("orderStats", ["orderStats"]),
    ...mapGetters("orderStats", [
      "getMinDate",
      "getMaxDate",
      "getFilteredStats",
      "statsSubidivisions",
      "driversFullnames",
    ]),
  },
  methods: {
    ...mapActions("orderStats", [
      "requestOrderStats",
      "requestOrderStatsDates",
    ]),
    dayjs,
    async openMap(order) {
      Dialog.create({
        component: MapOrder,
        componentProps: {
          order,
        },
      });
    },
    checkNull(val) {
      return val === null || val === undefined;
    },
    secondsDuration(val) {
      if (this.checkNull(val)) return null;
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
    regular(val) {
      if (this.checkNull(val)) return "-";
      return val;
    },
    operator(val) {
      if (val.order.isRequest) return val.order.customer.subdivision;
      return val.operatorFullname;
    },
    optionsFn(date) {
      return date >= this.getMinDate() && date <= this.getMaxDate();
    },
    boolean(val) {
      return val ? "Да" : "Нет";
    },
    createExcel() {
      getexcel(
        document.querySelector("#report-table > div > div > table"),
        "Отчет",
        `Отчет ${dayjs().format("DD.MM.YYYY HH:mm")}`
      );
    },
  },
  async mounted() {
    Loading.show();

    // this.height =
    //   // parseInt(this.$refs.page.$el.style.minHeight) -
    //   this.$refs.page.$el.clientHeight - this.$refs.header.clientHeight - 17;
    // this.width = this.$refs.page.$el.clientWidth;
    await this.requestOrderStatsDates();
    this._selectedDate = {
      from: dayjs().format("DD.MM.YYYY"),
      to: dayjs().format("DD.MM.YYYY"),
    };
    await this.requestOrderStats(this._selectedDate);
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
