<template>
    <q-page class="row bg-white">
        <div class="col q-pa-md">
            <Order />
        </div>
    </q-page>
</template>

<script>
import Order from "src/components/order/OrderComponent.vue";
export default {
    components: { Order }
}
</script>