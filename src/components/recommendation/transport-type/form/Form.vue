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
            label="Создать"
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
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, onMounted, defineEmits } from "vue";
import Description from "./fields/description.vue";
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

const creationMode = ref(false);

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

const resetForm = () => {
  loadNew();
  form.value.resetValidation();
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

const onSubmit = async () => {
  createTransportType();
  resetForm();
};

const onDelete = async () => {
  resetForm();
};

watch(
  () => props.selected,
  (newSelected, oldSelected) => {
    creationMode.value = !newSelected;
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
