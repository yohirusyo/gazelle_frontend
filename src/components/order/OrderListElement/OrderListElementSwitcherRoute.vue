<template>

    <div class="fit row items-center justify-center">
        <q-btn
            dense
            icon="las la-compress-arrows-alt"
            @click.stop="close"
            flat
            v-if="props.expand"
        >
            <q-tooltip>
                Скрыть маршрут
            </q-tooltip>
        </q-btn>
        <q-btn
            dense
            icon="las la-expand-arrows-alt"
            @click.stop="expand"
            flat
            v-else
        >
            <q-tooltip>
                Показать маршрут
            </q-tooltip>
        </q-btn>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    props: ['orderId', 'props'],
    computed: {
        ...mapGetters('order', ['isExpanded']),
    },
    methods: {
        expand() {
            // this.addToExpanded(this.orderId);
            this.props.expand = true;
        },
        close() {
            // this.removeFromExpanded(this.orderId);
            this.props.expand = false;
        },
        ...mapMutations('order', ['addToExpanded', 'removeFromExpanded'])
    }
}
</script>