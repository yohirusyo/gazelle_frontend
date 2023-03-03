<template>
    <div class="column col">
        <div class="col row justify-center items-center text-h3">
            <LimitChart />
        </div>
        <div class="col column">
            <div class="col col-shrink text-h6">
                Использование такси персоналом
            </div>
            <q-separator />
            <div class="col column">
                <div class="col">
                    <q-scroll-area style="height: 100%">

                        <HierarchyItem
                            :item="item"
                            v-for="item of myWorkers"
                            :key="item.id"
                        />
                    </q-scroll-area>
                </div>
                <AddToHierarchy class="col col-shrink" />
            </div>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AddToHierarchy from './AddToHierarchy.vue'
import HierarchyItem from './HierarchyItem.vue';
import LimitChart from './LimitChart.vue';
export default {
    components: {
        AddToHierarchy,
        HierarchyItem,
        LimitChart
    },
    computed: {
        ...mapGetters('hierarchy', ['myWorkers'])
    }
}

</script>