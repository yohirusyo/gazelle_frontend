<template>
  <div></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { socketio } from "boot/socketio";
import { useQuasar } from "quasar";
import Dialog from "./Dialog.vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";

const $q = useQuasar();

const store = useStore();

const cargoTypes = ref([]);

const subscribe = async () => {
  try {
    const { data } = await api.get("/recommendation/cargo-types");
    cargoTypes.value = data;
  } catch (error) {
    console.error("Ошибка получения типов ТС");
  }

  const { data: relatedCargoTypes } = await api.get(
    `/recommendation/related-cargo-types/5`
    //${transport.transportTypeId}`
  );

  console.log(relatedCargoTypes);

  socketio.on("free_transport_type", async (transport) => {
    const { data: relatedCargoTypes } = await api.get(
      `/recommendation/related-cargo-types/${transport.transportTypeId}`
    );
    const route = store["getters"]["order/getMostPrioritizedRoute"](
      transport.transportTypeId,
      cargoTypes.value,
      relatedCargoTypes.cargoTypes
    );

    $q.dialog({
      component: Dialog,
      componentProps: {
        transport,
        route,
      },
    })
      .onOk(() => {
        console.log("OK");
      })
      .onCancel(() => {
        console.log("Cancel");
      })
      .onDismiss(() => {
        console.log("Called on OK or Cancel");
      });
  });
};

onMounted(subscribe);

const unsubscribe = () => {
  console.log("auto-dialog unmounted");
  socketio.off("free_transport_type");
};

onUnmounted(unsubscribe);
</script>
