<template>
    <q-tr
        :props="props"
        :class="_class"
        @click="props.row.isDone ? null : onSelected(props.row)"
        :id="'order-list-item-' + props.row.id"
    >
        <q-td
            key="expand"
            :props="props"
        >
            <OrderListElementSwitcherRoute
                :orderId="props.row.orderId"
                :props="props"
                v-if="props.row.id == props.row.parentOrder"
            />
            <div v-else-if="props.row.parentOrder == null"> Одиночная</div>
            <div
                v-else
                class="column items-center"
            >
                <q-icon
                    class="q-ml-md"
                    name="las la-level-up-alt"
                    size="md"
                    color="grey"
                    style="transform: rotate(90deg);"
                />
                № {{ props.row.parentOrder }}
            </div>
        </q-td>
        <q-td
            key="time"
            :props="props"
        >
            <OrderListElementTime
                :id="props.row.id"
                :isEmergency="props.row.isEmergency"
                :orderTime="props.row.orderTime"
                :name="props.row.name"
                :description="props.row.description"
            />
        </q-td>
        <q-td
            key="customer"
            :props="props"
        >
            <OrderListElementCustomer :customerId="props.row.customerId" />
        </q-td>

        <q-td
            key="departurePoint"
            :props="props"
        >
            <OrderListElementPlace :placeId="props.row.departurePointId" />
        </q-td>
        <q-td
            key="destination"
            :props="props"
        >
            <OrderListElementPlace :placeId="props.row.destinationId" />
        </q-td>

        <q-td
            key="transportId"
            :props="props"
        >
            <OrderListElementTransport :transportId="props.row.transportId" />
        </q-td>
        <q-td
            key="status"
            :props="props"
        >
            <OrderListElementStatus
                :statusId="props.row.statusId"
                :statusChangedAt="props.row.statusChangedAt"
                :isDone="props.row.isDone"
            />
        </q-td>
        <q-td
            key="priority"
            :props="props"
        >
            <OrderPriority :orderId="props.row.id" />
        </q-td>
    </q-tr>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import OrderPriority from '../OrderPriority.vue';
import OrderListElementTime from './OrderListElementTime.vue';
import OrderListElementCustomer from './OrderListElementCustomer.vue';
import OrderListElementPlace from './OrderListElementPlace.vue';
import OrderListElementTransport from './OrderListElementTransport.vue';
import OrderListElementStatus from './OrderListElementStatus.vue';
import OrderListElementSwitcherRoute from './OrderListElementSwitcherRoute.vue';
export default {
    props: ['props'],
    methods: {
        ...mapMutations("current", ["setOrder"]),
        onSelected(sel) {
            this.$emit('onSelected', sel);
        }
    },
    components: {
        OrderPriority,
        OrderListElementStatus,
        OrderListElementTime,
        OrderListElementCustomer,
        OrderListElementPlace,
        OrderListElementTransport,
        OrderListElementSwitcherRoute
    },
    computed: {
        ...mapState('order', ['hovered']),
        _orderClass() {
            if ((this.hovered && this.hovered?.parentOrder != null && this.props.row.parentOrder != null && this.props.row.parentOrder == this.hovered.parentOrder) || this.hovered?.id == this.props.row.id)
                return 'hovered-order';
            if (this.props.row.isRequest && !this.props.row.isApproved)
                return 'bg-blue-2';
            if (this.props.row.isRequest && this.props.row.isApproved)
                return 'bg-blue-1';
            return '';
        },
        _endedClass() {
            if (this.props.row.isDone) return 'ended-order'
            return '';
        },
        _class() {
            return [this._orderClass, this._endedClass].join(' ')
        }
    }
}
</script>