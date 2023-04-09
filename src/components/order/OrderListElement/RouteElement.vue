<template>
    <OrderListElement
        :props="props"
        v-model="showed"
        :order="props.row.orders[0]"
        @onSelected="onSelected"
    />
    <OrderListElement
        v-for="o of route"
        :key="o.id"
        :props="props"
        :order="o"
        v-if="showed || _hoveredOrder"
        @onSelected="onSelected"
    />
</template>

<script>
import OrderListElement from "./OrderListElement.vue";
import { mapState } from 'vuex'
export default {
    props: ['props'],
    components: {
        OrderListElement // v-if="showed || _hoveredOrder"
    },
    data() {
        return {
            showed: false,
        }
    },
    computed: {
        ...mapState("order", ['hovered']),
        _hoveredOrder: {
            get() {
                return this.props.row.id === this.hovered?.id;
            },
        },
        route: {
            get() {
                return this.props.row.orders.slice(1);
            }
        }
    },
    methods: {
        onSelected() {
            this.$emit('onSelected', this.props.row);
        }
    }
}
</script>