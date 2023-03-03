<template>
    <div class="col column">
        <div class="col col-shrink text-h6">
            Дополнительный лимит
        </div>
        <q-separator  />
        <div class="col column">
            <div class="col">
                <q-scroll-area style="height: 100%">
                    <LimitRequestItem
                        :item="item"
                        v-for="item of myHierarchy?.requests"
                        :key="item.id"
                    />
                </q-scroll-area>
            </div>
            <AddLimitRequest class="col col-shrink" />
        </div>
    </div>
</template>

<script>
import LimitRequestItem from './LimitRequestItem.vue';
import AddLimitRequest from './AddLimitRequest.vue';
import { mapGetters } from 'vuex';
export default {
    components: {
        LimitRequestItem,
        AddLimitRequest
    },
    computed: {
        ...mapGetters('hierarchy', ['myHierarchy'])
    }
}

</script>