<template>
  <div class="col-2 text-center column items-center">
    <span>
      {{ "№ " + id }}
    </span>
    <q-chip
      class="q-mx-none q-mt-none"
      :class="isEmergency ? 'bg-red text-white' : ''"
    >
      <div>{{ orderTime ? timeFormat(orderTime) : "Маршрут" }}</div>
    </q-chip>
    <q-chip
      class="q-mx-none q-mt-none"
      style="font-size: 0.75rem"
      v-if="timeFormatOrder(orderTime)"
    >
      <div>
        {{ timeFormatOrder(orderTime) }}
      </div>
    </q-chip>
    <q-tooltip>
      <span>Наименование груза: {{ name }}</span>
      <br v-if="description && description != ''" />
      <span v-if="description && description != ''"
        >Описание: {{ description }}</span
      >
      <br /><span>Дата создания: {{ _createdAt }}</span> <br /><span v-if="maxWeight != 0"
        >Вес: {{ maxWeight }}</span
      >
    </q-tooltip>
  </div>
</template>

<script>
import { timeFormatOrder, timeFormat } from "src/helpers/formatters";
import dayjs from "dayjs";
export default {
  props: ["id", "isEmergency", "orderTime", "name", "description", "maxWeight", "createdAt"],
  methods: {
    timeFormat,
    timeFormatOrder,
  },
  computed: {
    _createdAt: {
      get() {
        return dayjs(this.createdAt).format("HH:mm DD.MM.YYYY");
      },
    },
  },
};
</script>
