<template>
    <q-page class="row bg-white">
        <OrderRequestCreation class="col" />
        <OrderHistory
            v-if="!$q.screen.xs"
            class="col"
        />
    </q-page>
</template>

<script>
import OrderRequestCreation from 'src/components/customer/form/OrderRequestCreation.vue';
import OrderHistory from 'src/components/customer/history/OrderHistory.vue';
export default {
    components: {
        OrderRequestCreation,
        OrderHistory
    }
}
</script>