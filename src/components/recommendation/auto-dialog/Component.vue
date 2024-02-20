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

const props = defineProps(["onSelfDisable"]);

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

  socketio.on("free_transport_type", async (transport) => {
    const { data: relatedCargoTypes } = await api.get(
      `/recommendation/related-cargo-types/${transport.transportTypeId}`
    );
    const route = store["getters"]["order/getMostPrioritizedRoute"](
      transport.transportTypeId,
      cargoTypes.value,
      relatedCargoTypes.cargoTypes
    );

    if (!route) return;

    $q.dialog({
      component: Dialog,
      componentProps: {
        transport,
        route,
        cargoTypes: cargoTypes.value,
      },
    })
      .onOk(async () => {
        const { fullname, phoneNumber, subdivision, mvz } = store.getters[
          "customer/getCustomerById"
        ](route.orders[0].customerId);

        await store.dispatch("order/updateRoute", {
          id: route.id,
          isApproved: true,
          isDeclined: false,
          isRequest: route.isRequest,
          orderTime: route.orderTime,
          departurePointName: store.getters["place/getPlaceById"](
            route.orders[0].departurePointId
          ).name,
          isEmergency: route.isEmergency,
          transportId: transport.id,
          customerPhoneNumber: phoneNumber,
          customerFullname: fullname,
          customerSubdivision: subdivision,
          customermvz: mvz,
          description: route.orders[0].description,
          elements: route.orders.map((order) => {
            const contact = store.getters["contact/getContactById"](
              order.contactId
            );
            const cargoReciever = store.getters["customer/getCustomerById"](
              order.cargoRecieverId
            );
            return {
              destinationName: store.getters["place/getPlaceById"](
                order.destinationId
              ).name,
              passengerCount: order.passengerCount,
              weight: order.weight,
              width: order.width,
              height: order.height,
              length: order.length,
              contactPhoneNumber: contact?.phoneNumber,
              contactFullname: contact?.fullname,
              cargoTypeId: order.cargoTypeId,
              withCargoTypeRequest: false,
              name: order.name,
              isNew: false,
              existingId: order.id,
              forDelete: false,
              cargoRecievedPhoneNumber: cargoReciever?.phoneNumber,
              cargoRecieverFullname: cargoReciever?.fullname,
              cargoRecieverSubdivision: cargoReciever?.subdivision,
              cargoRecieverMvz: cargoReciever?.mvz,
              scenario: order.scenario,
            };
          }),
        });
      })
      .onCancel(() => {
        props.onSelfDisable?.();
      });
  });
};

onMounted(subscribe);

const unsubscribe = () => {
  socketio.off("free_transport_type");
};

onUnmounted(unsubscribe);
</script>
