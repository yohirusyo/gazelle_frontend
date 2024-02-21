<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-pa-md column"
      style="height: 512px; width: 700px; max-width: 80vw"
    >
      <div class="text-h5 text-center">Автоназначение</div>
      <div class="column items-stretch col">
        <span class="text-center">{{
          props.transport.transportType.description
        }}</span>
        <div class="row justify-center">
          <AutoNumber
            :number="props.transport.transportNumber"
            class="col col-shrink"
          />
        </div>
        <div class="col q-pt-md">
          <q-table
            :rows-per-page-options="[0]"
            hide-bottom
            :rows="orderList"
            :columns="columns"
            row-key="id"
            flat
            dense
            table-header-class="bg-white"
            square
            separator="cell"
          >
            <template v-slot:body="props">
              <RouteElement
                :props="props"
                @onSelected="() => {}"
                :yesterdayTime="_yesterdayTime"
                :cargoTypes="props.cargoTypes"
              />
            </template>
          </q-table>
        </div>
      </div>
      <div class="row justify-between q-gutter-x-md">
        <q-btn
          text-color="white"
          label="Принять"
          unelevated
          class="border-none bg-blue-4 col"
          color="primary"
          no-caps
          dense
          @click="onOKClick"
        />
        <q-btn
          text-color="white"
          label="Отмена"
          unelevated
          class="border-none bg-green col"
          @click="onCancelClick"
          no-caps
          dense
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import { ref } from "vue";
import AutoNumber from "src/components/base/AutoNumber.vue";
import RouteElement from "src/components/order/list/element/Element.vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const props = defineProps({
  transport: Object,
  route: Object,
  cargoTypes: Array(Object),
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const onOKClick = () => onDialogOK();
const onCancelClick = () => onDialogCancel();

const orderList = ref([props.route]);

const columns = [
  {
    name: "expand",
    required: true,
    label: "Маршрут",
    align: "center",
    sortable: false,
  },
  {
    name: "time",
    required: true,
    label: "Время подачи",
    align: "center",
    sortable: false,
  },
  {
    name: "customer",
    required: true,
    label: "Ответственный",
    align: "center",
    sortable: false,
  },

  {
    name: "departurePoint",
    required: true,
    label: "Место отправления",
    align: "center",
    sortable: false,
  },
  {
    name: "destination",
    required: true,
    label: "Место назначения",
    align: "center",
    sortable: false,
  },
];

const _yesterdayTime = dayjs()
  .subtract(1, "day")
  .set("hour", 14)
  .set("minute", 0)
  .set("second", 0)
  .set("millisecond", 0)
  .utc()
  .unix();
</script>
