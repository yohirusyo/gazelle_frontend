<template>
    <q-tr
        :props="props"
        :class="_class"
        @click="order.isDone ? null : onSelected(order)"
        :id="'order-list-item-' + order.id"
    >
        <q-td
            key="expand"
            :props="props"
        >
            <OrderListElementSwitcherRoute
                v-model="_modelValue"
                v-if="order.id == order.parentOrder && props.row.orders.length != 1"
            />
            <div v-else-if="props.row.orders.length == 1 || order.parentOrder == null"> Одиночная</div>
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
                № {{ order.parentOrder }}
            </div>
        </q-td>
        <q-td
            key="time"
            :props="props"
        >
            <OrderListElementTime
                :id="order.id"
                :isEmergency="order.isEmergency"
                :orderTime="order.orderTime"
                :name="order.name"
                :description="order.description"
            />
        </q-td>
        <q-td
            key="customer"
            :props="props"
        >
            <OrderListElementCustomer :customerId="order.customerId" />
        </q-td>

        <q-td
            key="departurePoint"
            :props="props"
        >
            <OrderListElementPlace :placeId="order.departurePointId" />
        </q-td>
        <q-td
            key="destination"
            :props="props"
        >
            <OrderListElementPlace :placeId="order.destinationId" />
        </q-td>

        <q-td
            key="transportId"
            :props="props"
        >
            <OrderListElementTransport :transportId="order.transportId" />
        </q-td>
        <q-td
            key="status"
            :props="props"
        >
            <OrderListElementStatus
                :statusId="order.statusId"
                :statusChangedAt="order.statusChangedAt"
                :isDone="order.isDone"
            />
        </q-td>
      
    </q-tr>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import OrderListElementTime from './OrderListElementTime.vue';
import OrderListElementCustomer from './OrderListElementCustomer.vue';
import OrderListElementPlace from './OrderListElementPlace.vue';
import OrderListElementTransport from './OrderListElementTransport.vue';
import OrderListElementStatus from './OrderListElementStatus.vue';
import OrderListElementSwitcherRoute from './OrderListElementSwitcherRoute.vue';
export default {
    props: ['props', 'modelValue', 'order'],
    methods: {
        ...mapMutations("current", ["setOrder"]),
        onSelected(sel) {
            this.$emit('onSelected', sel);
        }
    },
    components: {
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
            if (this.hovered && this.hovered.orders.map(o => o.id).includes(this.order.id))
                return 'hovered-order';
            if (this.order.isRequest && !this.order.isApproved)
                return 'bg-blue-2';
            if (this.order.isRequest && this.order.isApproved)
                return 'bg-blue-1';
            return '';
        },
        _endedClass() {
            if (this.order.isDone) return 'ended-order'
            return '';
        },
        _class() {
            return [this._orderClass, this._endedClass].join(' ')
        },
        _modelValue: {
            get() { return this.modelValue },
            set(val) { this.$emit("update:modelValue", val); }
        }
    }
}
</script>