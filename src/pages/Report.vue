<template>
  <q-page>
    <div class="column fit">
      <div
        class="col col-shrink  justify-center items-stretch  q-pa-sm"
        :class="!$q.screen.xs ? 'q-gutter-x-md row' : 'q-gutter-y-md column'"
      >
        <download-excel
          :data="
            getFilteredStats(_selectedDriverFullname, _selectedSubdivision)
          "
          :fields="fields"
          :name="`Отчет ${moment().format('DD.MM.YYYY HH:mm')}.xls`"
          class="col row"
        >
          <q-btn
            text-color="white"
            label="Экспорт в excel"
            icon="las la-file-excel"
            unelevated
            class="col bg-white text-black border-none"
            flat
            no-caps
          />
        </download-excel>
        <ISelect
          :options="statsSubidivisions"
          v-model="_selectedSubdivision"
          :labelFn="(item) => item"
          label="Подразделение"
          @selected="(val) => (_selectedSubdivision = val)"
          class="col  text-black border-none"
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
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
          >
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
                <q-btn
                  v-close-popup
                  label="Закрыть"
                  color="primary"
                  flat
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
      </div>
      <div
        class="col"
        ref="table"
        id="table"
      >
        <q-table
          :rows="getFilteredStats(_selectedDriverFullname, _selectedSubdivision)"
          flat
          dense
          table-header-class="bg-white"
          square
          separator="cell"
          :columns="columns"
          hide-bottom
          class="my-sticky-header-table"
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
          :style="`height: ${height}px; width: ${width}px`"
          row-key="id"
          v-model:selected="_selectedRow"
          selection="multiple"
        >
        </q-table>
      </div>
    </div>



  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import * as moment from "moment";
import { Loading } from "quasar";
import ISelect from "components/base/ISelect.vue";
export default {
  name: "Report",
  components: {
    ISelect,
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
      fields: {
        "Номер заказа": {
          field: "orderId",
          callback: this.regular,
        },
        Диспетчер: {
          // field: "operatorFullname",
          callback: this.operator,
        },
        Статус: {
          field: "order.isDeleted",
          callback: (val) => (!val ? "Завершен" : "Удален"),
        },
        "Наименование груза": {
          field: "order.name",
          callback: this.regular,
        },
        Комментарий: {
          field: "order.description",
          callback: this.regular,
        },
        "Время заказа": {
          field: "order.orderedAt",
          callback: this.HHmm,
        },
        Дата: {
          field: "order.orderTime",
          callback: this.DDMMYYYY,
        },
        "Время подачи ( плановое )": {
          field: "order.orderTime",
          callback: this.HHmm,
        },
        "Время принятия заявки водителем": {
          field: "acceptedAt",
          callback: this.HHmm,
        },
        "Время подачи ( фактическое )": {
          field: "entryToCustomerFact",
          callback: this.HHmm,
        },
        "Время убытия в место назначения": {
          field: "exitToDestinationFact",
          callback: this.HHmm,
        },
        "Время прибытия в место назначения": {
          field: "entryToDestinationFact",
          callback: this.HHmm,
        },
        Подразделение: {
          field: "order.customer.subdivision",
          callback: this.regular,
        },
        Ответственный: {
          field: "order.customer.fullname",
          callback: this.regular,
        },
        Телефон: {
          field: "order.customer.phoneNumber",
          callback: this.regular,
        },
        "Место отправления": {
          field: "order.departurePoint.name",
          callback: this.regular,
        },
        "Место назначения": {
          field: "order.destination.name",
          callback: this.regular,
        },
        "Кол-во пассажиров": {
          field: "order.passengerCount",
          callback: this.regular,
        },
        Вес: {
          field: "order.weight",
          callback: this.regular,
        },
        Длина: {
          field: "order.length",
          callback: this.regular,
        },
        Ширина: {
          field: "order.width",
          callback: this.regular,
        },
        Высота: {
          field: "order.height",
          callback: this.regular,
        },
        "Контактное лицо": {
          field: "order.contact.fullname",
          callback: this.regular,
        },
        "Телефон ": {
          field: "order.contact.phoneNumber",
          callback: this.regular,
        },
        "Тип траспорта": {
          field: "transportNumber",
          callback: this.regular,
        },
        Номер: {
          field: "transportNumber",
          callback: this.regular,
        },
        Водитель: {
          field: "driverFullname",
          callback: this.regular,
        },
        "Телефон  ": {
          field: "driverPhoneNumber",
          callback: this.regular,
        },
        "Место получения текущей заявки": {
          field: "place.name",
          callback: this.regular,
        },
        "Время окончания заказа": {
          field: "doneAt",
          callback: this.HHmm,
        },
        "Время между заказами": {
          field: "timeBetweenOrders",
          callback: this.secondsDuration,
        },
        "Время до принятия заявки": {
          field: "timeBeforeAccepted",
          callback: this.secondsDuration,
        },
        "Время до прибытия к заказчику": {
          field: "timeEntryToCustomer",
          callback: this.secondsDuration,
        },
        "Время загрузки": {
          field: "loadingTime",
          callback: this.secondsDuration,
        },
        "Время в движении": {
          field: "driveTime",
          callback: this.secondsDuration,
        },
        "Время разгрузки": {
          field: "unloadingTime",
          callback: this.secondsDuration,
        },
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
          label: "Номер заказа",
          align: "left",
          field: (row) => row.order.isDeleted,
          format: (val) => (!val ? "Завершен" : "Удален"),
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
          name: "orderedAt",
          required: true,
          label: "Время заказа",
          align: "left",
          field: (row) => row.order.orderedAt,
          format: this.HHmm,
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
          name: "customerSubdivision",
          required: true,
          label: "Подразделение",
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
        {
          name: "customerPhoneNumber",
          required: true,
          label: "Телефон",
          align: "left",
          field: (row) => row.order.customer.phoneNumber,
          format: this.regular,
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
        {
          name: "contactPhoneNumber",
          required: true,
          label: "Телефон",
          align: "left",
          field: (row) => row.order.contact?.phoneNumber,
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
        {
          name: "driverPhoneNumber",
          required: true,
          label: "Телефон",
          align: "left",
          field: (row) => row.driverPhoneNumber,
          format: this.regular,
          sortable: true,
        },
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
          name: "loadingTime",
          required: true,
          label: "Время загрузки",
          align: "left",
          field: (row) => row.loadingTime,
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
          name: "unloadingTime",
          required: true,
          label: "Время разгрузки",
          align: "left",
          field: (row) => row.unloadingTime,
          format: this.secondsDuration,
          sortable: true,
        },
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
    moment,
    checkNull(val) {
      return val === null || val === undefined;
    },
    secondsDuration(val) {
      if (this.checkNull(val)) return null;
      return moment
        .utc(moment.duration(val, "milliseconds").asMilliseconds())
        .format("HH:mm:ss");
    },
    DDMMYYYY(val) {
      if (this.checkNull(val)) return null;
      return moment(val).format("DD.MM.YYYY");
    },
    HHmm(val) {
      if (this.checkNull(val)) return null;
      return moment(val).format("HH:mm");
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
      return date >= this.getMinDate() && date <= this.getMaxDate();
    },
  },
  async mounted() {
    Loading.show();
    this.height = this.$refs.table.clientHeight;
    this.width = this.$refs.table.clientWidth;
    await this.requestOrderStatsDates();
    this._selectedDate = {
      from: moment().format("DD.MM.YYYY"),
      to: moment().format("DD.MM.YYYY"),
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
</style>
