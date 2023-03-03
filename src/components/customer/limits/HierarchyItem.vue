<template>
    <div class="column">
        <div class="row items-center">
            <div class="col-5">{{ getCustomerById(item?.ownerId)?.fullname }}</div>
            <div class="col-2">{{ percentage }}</div>
            <div class="col-2">{{ item.monthFactLimit }}</div>
            <div class="col-2">{{ item?.dayLimitUsed }}</div>
            
        </div>
        <div
            class="col column q-mx-md"
            v-if="filteredRequests.length !=0"
        >
            <div>Запросы на пополнение</div>
            <q-separator />
            <div v-for="request in filteredRequests">
                <LimitApprovement
                    :item="request"
                    :isAdmin="false"
                    class=" q-my-sm"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LimitApprovement from './LimitApprovement.vue';
export default {
    props: ['item'],
    computed: {
        ...mapGetters('customer', ['getCustomerById']),
        ...mapGetters('hierarchy', ['myHierarchy']),
        filteredRequests: {
            get() {
                return this.item?.requests?.filter(item => !item.approved && !item.declined) || []
            }
        },
        percentage: {
            get() {
                return `${(this.item.monthFactLimit / this.myHierarchy.monthFactLimit * 100).toFixed(2)} %`
            }
        }
    },
    components: {
        LimitApprovement
    }
}
</script>