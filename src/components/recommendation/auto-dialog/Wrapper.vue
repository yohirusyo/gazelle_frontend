<template>
  <AutoDialog v-if="auto" :on-self-disable="() => (auto = false)" />
  <q-checkbox
    class="col"
    v-model="auto"
    size="xs"
    :disable="autoAdmin === false"
  >
    <q-tooltip> Автоназначение </q-tooltip>
  </q-checkbox>
  <q-checkbox
    class="col"
    v-model="autoAdmin"
    size="xs"
    color="red"
    v-if="store.state.current.currentUser.role === 'ADMIN'"
  >
    <q-tooltip> Автоназначение (АДМИН) </q-tooltip>
  </q-checkbox>
</template>

<script setup>
import AutoDialog from "src/components/recommendation/auto-dialog/Component.vue";
import { ref, onMounted, computed, onUnmounted } from "vue";
import { api } from "src/boot/axios";
import { socketio } from "src/boot/socketio";
import { useStore } from "vuex";

const store = useStore();

const auto = ref(false);
const _adminAuto = ref(false);

const getRecommendationConfig = async () => {
  const { data } = await api.get(`/recommendation/config`);
  auto.value = data.autoTransport;
  _adminAuto.value = data.autoTransport;
};

const updateConfig = async (body) => {
  await api.patch(`/recommendation/config`, body);
};

const autoAdmin = computed({
  get() {
    return _adminAuto.value;
  },
  set(val) {
    (async () => {
      await updateConfig({ autoTransport: val });
    })();
  },
});

onMounted(async () => {
  await getRecommendationConfig();
  socketio.on("config_update", async (data) => await getRecommendationConfig());
});

onUnmounted(() => {
  socketio.off("config_update");
});
</script>
