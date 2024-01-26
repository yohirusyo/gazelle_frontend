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
import Description from "./fields/Description.vue";
import Priority from "./fields/Priority.vue";
import { api } from "src/boot/axios";

const props = defineProps({
  selected: Object,
});
const emit = defineEmits(["done"]);

const creationMode = ref(false);

const description = ref("");
const priority = ref(1);

const loadNew = () => {
  description.value = "";
  priority.value = 1;
};

const form = ref(null);

const resetForm = () => {
  loadNew();
  form.value.resetValidation();
  emit("done");
};

const createCargoType = async () => {
  await api.post("/recommendation/cargo-types", {
    description: description.value,
    priority: priority.value,
  });
};

const onSubmit = async () => {
  createCargoType();
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
    priority.value = props.selected.priority;
  } else {
    loadNew();
  }
};

onMounted(loadData);
</script>
