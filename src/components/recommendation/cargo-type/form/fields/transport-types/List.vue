<template>
  <div class="col column">
    <div class="col q-mb-sm" style="border: 1px solid rgba(0, 0, 0, 0.12)">
      <div class="q-my-sm q-mx-md">Привязанные типы ТС</div>
      <div class="q-ma-sm row q-pa-sm items-center">
        <div class="col-5">Тип ТС</div>
        <div class="col-5">Приоритет ТС для груза</div>
        <div class="col-2 row justify-end"></div>
      </div>
      <TransportTypeCard
        v-for="transportType of relatedTransportTypes"
        :key="transportType.id"
        :transportType="transportType"
      />
    </div>
    <CreationForm
      :cargoTypeId="id"
      :relatedTransportTypes="relatedTransportTypes"
    />
  </div>
  <div></div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref, watch, onMounted, provide } from "vue";
import CreationForm from "./Form.vue";
import TransportTypeCard from "./Card.vue";

const props = defineProps({
  id: Number,
});

const relatedTransportTypes = ref([]);

const fetchRelatedTransportTypes = async (cargoTypeId) => {
  const { data } = await api.get(
    `/recommendation/related-transport-types/${cargoTypeId}`
  );
  relatedTransportTypes.value = data.transportTypes;
};

watch(
  () => props.id,
  (newId, oldId) => {
    if (oldId != newId) {
      fetchRelatedTransportTypes(newId);
    }
  }
);

provide(
  "fetchRelatedTransportTypes",
  async () => await fetchRelatedTransportTypes(props.id)
);

onMounted(async () => {
  await fetchRelatedTransportTypes(props.id);
});
</script>
