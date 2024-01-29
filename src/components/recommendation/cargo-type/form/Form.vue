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
        <Priority v-model="priority" />
        <q-checkbox v-model="withEmergency">
          Возможность создания аварийной заявки
        </q-checkbox>
        <TransportTypesList v-if="!creationMode" :id="selected.id" />
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
            v-if="creationMode"
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
  computed,
  onMounted,
  defineEmits,
  inject,
  watch,
} from "vue";
import Description from "./fields/Description.vue";
import Priority from "./fields/Priority.vue";
import TransportTypesList from "./fields/transport-types/List.vue";
import { api } from "src/boot/axios";

const props = defineProps({
  selected: Object,
});
const emit = defineEmits(["done"]);

const creationMode = computed(() => !props.selected);

const description = ref("");
const priority = ref(1);
const withEmergency = ref(false);

const loadNew = () => {
  description.value = "";
  priority.value = 1;
  withEmergency.value = false;
};

const form = ref(null);

const fetchCargoTypes = inject("fetchCargoTypes");

const resetForm = async () => {
  loadNew();
  form.value.resetValidation();
  await fetchCargoTypes();
  emit("done");
};

const createCargoType = async () => {
  await api.post("/recommendation/cargo-types", {
    description: description.value,
    priority: priority.value,
    withEmergency: withEmergency.value,
  });
};

const onSubmit = async () => {
  createCargoType();
  resetForm();
};

const onDelete = async () => {
  await api.delete(`/recommendation/cargo-types/${props.selected.id}`);
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
    priority.value = props.selected.priority;
    withEmergency.value = props.selected.withEmergency;
  } else {
    loadNew();
  }
};

onMounted(loadData);
</script>
