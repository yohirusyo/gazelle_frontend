<template>
    <div
        class="row col"
        v-if="!$q.screen.xs "
    >
        <div class="col q-pa-md column" :class="$q.screen.xs ? 'col-12' : ''">
            <div class="col column">
                <Owner />
                <Percentage />

            </div>
            <LimitRequests />
        </div>
        <div class="col q-pa-md column" :class="$q.screen.xs ? 'col-12' : ''">
            <Hierarchy />
        </div>
    </div>
    <div v-else>
        <div class="q-pa-md " style="height: 100vh;">
            <div class="col">
                <Owner />
                <Percentage />

            </div>
            <LimitRequests />
        </div>
        <div class="col q-pa-md column" style="height: 100vh;">
            <Hierarchy />
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Owner from './Owner.vue';
import Percentage from './Percentage.vue';
import Hierarchy from './Hierarchy.vue';
import LimitRequests from './LimitRequests.vue';
export default {
    components: {
        Owner,
        Percentage,
        Hierarchy,
        LimitRequests
    },
    methods: {
        ...mapActions('management', ['requestMyManagement']),
    },
    async mounted() {
        await this.requestMyManagement();
    }
};
</script>