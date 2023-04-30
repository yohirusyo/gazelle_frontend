<template>
    <div class="col-2 text-center column items-center">
        <span>
            {{ "№ " + id }}
        </span>
        <q-chip
            class="q-mx-none q-mt-none "
            :class="isEmergency ? 'bg-red text-white' : ''"
        >
            <div> {{
                orderTime
                    ? timeFormat(orderTime)
                    : "Маршрут"
            }}
            </div>

        </q-chip>
        <q-chip
            class="q-mx-none q-mt-none "
            style="font-size: 0.75rem;"
            v-if="timeFormatOrder(orderTime)"
        >
            <div>
                {{ timeFormatOrder(orderTime) }}
            </div>
        </q-chip>
        <q-tooltip>
            <span>Наименование груза: {{ name }}</span>
            <br v-if="description && description != ''" />
            <span v-if="description && description != ''">Описание: {{
                description
            }}</span>
        </q-tooltip>
    </div>
</template>

<script>
import { timeFormatOrder, timeFormat } from 'src/helpers/formatters'
export default {
    props: [
        'id',
        'isEmergency',
        'orderTime',
        'name',
        'description'
    ],
    methods: {
        timeFormat,
        timeFormatOrder,
    }
}
</script>