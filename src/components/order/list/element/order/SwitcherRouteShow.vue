<template>
    <div class="fit row items-center justify-center">
        <q-btn
            dense
            icon="las la-compress-arrows-alt"
            @click.stop="_modelValue = !_modelValue"
            flat
            v-if="_modelValue"
        >
            <q-tooltip>
                Скрыть маршрут
            </q-tooltip>
        </q-btn>
        <q-btn
            dense
            icon="las la-expand-arrows-alt"
            @click.stop="_modelValue = !_modelValue"
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
    props: ['orderId', 'props', 'modelValue'],
    computed: {
        ...mapGetters('order', ['isExpanded']),
        _modelValue: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit("update:modelValue", val);
            }
        },
    },
    methods: {
        ...mapMutations('order', ['addToExpanded', 'removeFromExpanded'])
    }
}
</script>