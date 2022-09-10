<template>
    <q-page>
        <download-excel :data="orderStats" :fields="fields" :name="`Отчет ${moment().format('DD.MM.YYYY HH:mm')}.xls`">
            <q-btn text-color="white" label="Экспорт в excel" icon="las la-file-excel" unelevated
                class="border-sm shadow-white bg-green q-mx-lg q-mb-sm q-mt-md" flat no-caps />
        </download-excel>
        <q-table :rows="orderStats" :columns="columns" row-key="name" hide-bottom class="q-mx-lg q-my-sm" />
    </q-page>
</template>
  
<script>
import { mapActions, mapState } from 'vuex';
import * as moment from 'moment';

export default {
    name: "Report",
    data() {
        return {
            fields: {
                "Номер заказа": "orderId",
                'Наименование груза': 'order.name',
                'Комментарий': {
                    field: "order.description",
                    callback: (val) => {
                        return val ? val : '-';
                    },
                },
                'Время заказа': {
                    field: "order.orderedAt",
                    callback: (val) => {
                        return moment(val).format('HH:mm');
                    },
                },
                'Дата': {
                    field: "order.orderTime",
                    callback: (val) => {
                        return moment(val).format('DD.MM.YYYY');
                    },
                },
                'Время подачи ( плановое )': {
                    field: "order.orderTime",
                    callback: (val) => {
                        return moment(val).format('HH:mm');
                    },
                },
                'Время принятия заявки водителем': {
                    field: "acceptedAt",
                    callback: (val) => {
                        return moment(val).format('HH:mm');
                    },
                },
                'Время подачи ( фактическое )': {
                    field: "entryToCustomerFact",
                    callback: (val) => {
                        return moment(val).format('HH:mm');
                    },
                },
                'Время убытия в место назначения': {
                    field: "exitToDestinationFact",
                    callback: (val) => {
                        return moment(val).format('HH:mm');
                    },
                },
                'Время прибытия в место назначения': {
                    field: "entryToDestinationFact",
                    callback: (val) => {
                        return moment(val).format('HH:mm');
                    },
                },
                'Подразделение': 'order.customer.subdivision',
                'Ответственный': 'order.customer.fullname',
                'Телефон': 'order.customer.phoneNumber',
                'Место отправления': 'order.departurePoint.name',
                'Место назначения': 'order.destination.name',
                'Кол-во пассажиров': 'order.passengerCount',
                'Вес': 'order.weight',
                'Длина': 'order.length',
                'Ширина': 'order.width',
                'Высота': 'order.height',
                'Контактное лицо': 'order.contact.fullname',
                'Телефон ': 'order.contact.phoneNumber',
                'Тип траспорта': 'transportNumber',
                'Номер': 'transportNumber',
                'Водитель': 'driverFullname',
                'Телефон  ': 'driverPhoneNumber',
                'Место получения текущей заявки': {
                    field: "place.name",
                    callback: (val) => {
                        return val ? val : '-'
                    },
                },
                'Время окончания заказа': {
                    field: "doneAt",
                    callback: (val) => {
                        return moment(val).format('HH:mm');
                    },
                },
                'Время между заказами': {
                    field: "timeBetweenOrders",
                    callback: (val) => {
                        return moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss");
                    },
                },
                'Время до принятия заявки': {
                    field: "timeBeforeAccepted",
                    callback: (val) => {
                        return moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss");
                    },
                },
                'Время до прибытия к заказчику': {
                    field: "timeEntryToCustomer",
                    callback: (val) => {
                        return moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss");
                    },
                },
                'Время загрузки': {
                    field: "loadingTime",
                    callback: (val) => {
                        return moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss");
                    },
                },
                'Время в движении': {
                    field: "driveTime",
                    callback: (val) => {
                        return moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss");
                    },
                },
                'Время разгрузки': {
                    field: "unloadingTime",
                    callback: (val) => {
                        return moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss");
                    },
                },
            },
            columns: [
                {
                    name: 'orderId',
                    required: true,
                    label: 'Номер заказа',
                    align: 'left',
                    field: row => row.orderId,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'name',
                    required: true,
                    label: 'Наименование груза',
                    align: 'left',
                    field: row => row.order.name,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'descriptiom',
                    required: true,
                    label: 'Комментарий',
                    align: 'left',
                    field: row => row.order.description,
                    format: val => val ? val : '-',
                    sortable: true
                },
                {
                    name: 'orderedAt',
                    required: true,
                    label: 'Время заказа',
                    align: 'left',
                    field: row => row.order.orderedAt,
                    format: val => moment(val).format('HH:mm'),
                    sortable: true
                },
                {
                    name: 'date',
                    required: true,
                    label: 'Дата',
                    align: 'left',
                    field: row => row.order.orderTime,
                    format: val => moment(val).format('DD.MM.YYYY'),
                    sortable: true
                },
                {
                    name: 'orderTime',
                    required: true,
                    label: 'Время подачи ( плановое )',
                    align: 'left',
                    field: row => row.order.orderTime,
                    format: val => moment(val).format('HH:mm'),
                    sortable: true
                },
                {
                    name: 'accepted',
                    required: true,
                    label: 'Время принятия заявки водителем',
                    align: 'left',
                    field: row => row.acceptedAt,
                    format: val => moment(val).format('HH:mm'),
                    sortable: true
                },
                {
                    name: 'entryToCustomer',
                    required: true,
                    label: 'Время подачи ( фактическое )',
                    align: 'left',
                    field: row => row.entryToCustomerFact,
                    format: val => moment(val).format('HH:mm'),
                    sortable: true
                },
                {
                    name: 'exitToDestination',
                    required: true,
                    label: 'Время убытия в место назначения',
                    align: 'left',
                    field: row => row.exitToDestinationFact,
                    format: val => moment(val).format('HH:mm'),
                    sortable: true
                },
                {
                    name: 'exitToDestination',
                    required: true,
                    label: 'Время прибытия в место назначения',
                    align: 'left',
                    field: row => row.exitToDestinationFact,
                    format: val => moment(val).format('HH:mm'),
                    sortable: true
                },
                {
                    name: 'customerSubdivision',
                    required: true,
                    label: 'Подразделение',
                    align: 'left',
                    field: row => row.order.customer.subdivision,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'customerFullname',
                    required: true,
                    label: 'Ответственный',
                    align: 'left',
                    field: row => row.order.customer.fullname,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'customerPhoneNumber',
                    required: true,
                    label: 'Телефон',
                    align: 'left',
                    field: row => row.order.customer.phoneNumber,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'departurePoint',
                    required: true,
                    label: 'Место отправления',
                    align: 'left',
                    field: row => row.order.departurePoint.name,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'destination',
                    required: true,
                    label: 'Место назначения',
                    align: 'left',
                    field: row => row.order.destination.name,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'passengerCount',
                    required: true,
                    label: 'Кол-во пассажиров',
                    align: 'left',
                    field: row => row.order.passengerCount,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'weight',
                    required: true,
                    label: 'Вес',
                    align: 'left',
                    field: row => row.order.weight,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'length',
                    required: true,
                    label: 'Длина',
                    align: 'left',
                    field: row => row.order.length,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'width',
                    required: true,
                    label: 'Ширина',
                    align: 'left',
                    field: row => row.order.width,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'height',
                    required: true,
                    label: 'Высота',
                    align: 'left',
                    field: row => row.order.height,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'contactFullname',
                    required: true,
                    label: 'Контактное лицо',
                    align: 'left',
                    field: row => row.order.contact.fullname,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'contactPhoneNumber',
                    required: true,
                    label: 'Телефон',
                    align: 'left',
                    field: row => row.order.contact.phoneNumber,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'transportType',
                    required: true,
                    label: 'Тип траспорта',
                    align: 'left',
                    field: row => row.transportType,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'transportNumber',
                    required: true,
                    label: 'Номер',
                    align: 'left',
                    field: row => row.transportNumber,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'driverFullname',
                    required: true,
                    label: 'Водитель',
                    align: 'left',
                    field: row => row.driverFullname,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'driverPhoneNumber',
                    required: true,
                    label: 'Телефон',
                    align: 'left',
                    field: row => row.driverPhoneNumber,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'placeName',
                    required: true,
                    label: 'Место получения текущей заявки',
                    align: 'left',
                    field: row => row.place ? row.place.name : '-',
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'doneAt',
                    required: true,
                    label: 'Время окончания заказа',
                    align: 'left',
                    field: row => row.doneAt,
                    format: val => moment(val).format('HH:mm'),
                    sortable: true
                },
                {
                    name: 'timeBetweenOrders',
                    required: true,
                    label: 'Время между заказами',
                    align: 'left',
                    field: row => row.timeBetweenOrders,
                    format: val => moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss"),
                    sortable: true
                },
                {
                    name: 'timeBeforeAccepted',
                    required: true,
                    label: 'Время до принятия заявки',
                    align: 'left',
                    field: row => row.timeBeforeAccepted,
                    format: val => moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss"),
                    sortable: true
                },
                {
                    name: 'timeEntryToCustomer',
                    required: true,
                    label: 'Время до прибытия к заказчику',
                    align: 'left',
                    field: row => row.timeEntryToCustomer,
                    format: val => moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss"),
                    sortable: true
                },
                {
                    name: 'loadingTime',
                    required: true,
                    label: 'Время загрузки',
                    align: 'left',
                    field: row => row.loadingTime,
                    format: val => moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss"),
                    sortable: true
                },
                {
                    name: 'driveTime',
                    required: true,
                    label: 'Время в движении',
                    align: 'left',
                    field: row => row.driveTime,
                    format: val => moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss"),
                    sortable: true
                },
                {
                    name: 'unloadingTime',
                    required: true,
                    label: 'Время разгрузки',
                    align: 'left',
                    field: row => row.unloadingTime,
                    format: val => moment.utc(moment.duration(val, "milliseconds").asMilliseconds()).format("HH:mm:ss"),
                    sortable: true
                },
            ]
        }
    },
    computed: {
        ...mapState('orderStats', ['orderStats'])
    },
    methods: {
        ...mapActions('orderStats', ['requestOrderStats']),
        moment
    },
    async mounted() {
        this.requestOrderStats();
    }
};
</script>
  
<style lang="scss" scoped>

</style>
  