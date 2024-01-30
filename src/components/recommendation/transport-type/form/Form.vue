<template>
  <div class="col column">
    <q-form
      class="col column justify-between"
      :class="$q.screen.xs ? 'q-pl-xs q-py-xs' : 'q-pa-md'"
      ref="form"
      @submit="onSubmit"
      @reset="resetForm"
    >
      <div class="column col q-gutter-y-md">
        <Description v-model="description" />
        <Weight v-model="weight" />
        <Length v-model="length" />
        <Width v-model="width" />
        <Height v-model="height" />
        <PassengerSeats v-model="passengerSeats" />
      </div>

      <div class="col col-shrink q-gutter-y-sm column">
        <div class="col row q-gutter-x-sm items-center">
          <q-btn
            text-color="white"
            :label="creationMode ? 'Создать' : 'Обновить'"
            unelevated
            class="border-none col bg-blue-4"
            type="submit"
            no-caps
            dense
          />

          <q-btn
            text-color="white"
            label="Удалить"
            unelevated
            class="border-none col bg-red"
            no-caps
            dense
            @click="onDelete"
            v-if="!creationMode"
          />

          <q-btn
            text-color="white"
            label="Отмена"
            unelevated
            class="border-none col bg-red"
            no-caps
            dense
            @click="resetForm"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import {
  ref,
  defineProps,
  onMounted,
  defineEmits,
  inject,
  computed,
  watch,
} from "vue";
import Description from "./fields/Description.vue";
import Weight from "./fields/Weight.vue";
import Length from "./fields/Length.vue";
import Width from "./fields/Width.vue";
import Height from "./fields/Height.vue";
import PassengerSeats from "./fields/PassengerSeats.vue";
import { api } from "src/boot/axios";

const props = defineProps({
  selected: Object,
});
const emit = defineEmits(["done"]);

const creationMode = computed(() => !props.selected);

const description = ref("");
const weight = ref(0);
const length = ref(0);
const width = ref(0);
const height = ref(0);
const passengerSeats = ref(0);

const loadNew = () => {
  description.value = "";
  weight.value = 0;
  length.value = 0;
  width.value = 0;
  height.value = 0;
  passengerSeats.value = 0;
};

const form = ref(null);

const fetchTransportTypes = inject("fetchTransportTypes");

const resetForm = async () => {
  loadNew();
  form.value.resetValidation();
  await fetchTransportTypes();
  emit("done");
};

const createTransportType = async () => {
  await api.post("/recommendation/transport-types", {
    description: description.value,
    weight: weight.value,
    length: length.value,
    width: width.value,
    height: height.value,
    passengerSeats: passengerSeats.value,
  });
};

const updateTransportType = async () => {
  await api.patch(`/recommendation/transport-types/${props.selected.id}`, {
    description: description.value,
    weight: weight.value,
    length: length.value,
    width: width.value,
    height: height.value,
    passengerSeats: passengerSeats.value,
  });
};

const onSubmit = async () => {
  if (creationMode.value) {
    await createTransportType();
  } else {
    await updateTransportType();
  }
  resetForm();
};

const onDelete = async () => {
  await api.delete(`/recommendation/transport-types/${props.selected.id}`);
  resetForm();
};

watch(
  () => props.selected,
  (newSelected, oldSelected) => {
    if (newSelected != oldSelected) loadData();
  }
);

const loadData = () => {
  if (props.selected) {
    description.value = props.selected.description;
    weight.value = props.selected.weight;
    length.value = props.selected.length;
    width.value = props.selected.width;
    height.value = props.selected.height;
    passengerSeats.value = props.selected.passengerSeats;
  } else {
    loadNew();
  }
};

onMounted(loadData);
</script>
