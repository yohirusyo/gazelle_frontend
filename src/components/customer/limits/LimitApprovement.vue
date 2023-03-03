<template>
    <div class="row items-center">
        <div class="col-8">{{ item.amount }}</div>
        <div class="col-2 row q-px-md" v-if="!item.approved && !item.declined">
            <q-btn
                text-color="white"
                label="Принять"
                unelevated
                class="border-none bg-blue-4 col"
                @click="approve"
                no-caps
                :disabled="!isAdmin && freeLimit < item.amount"
            />
        </div>
        <div class="col-2 row q-px-md" v-if="!item.approved && !item.declined">
            <q-btn
                text-color="white"
                label="Отклонить"
                unelevated
                class="border-none bg-red col"
                @click="decline"
                no-caps
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    props: ['item', 'isAdmin'],
    computed: {
        ...mapGetters('hierarchy', ['freeLimit'])
    },
    methods: {
        ...mapActions('hierarchy', ['changeRequestLimitStatus']),
        async approve() {
            await this.changeRequestLimitStatus({
                id: this.item.id,
                approved: true,
            })
        },
        async decline() {
            await this.changeRequestLimitStatus({
                id: this.item.id,
                declined: true,
            })
        }
    }
}
</script>