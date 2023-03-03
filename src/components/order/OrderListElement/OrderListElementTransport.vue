<template>
    <div
        class="row justify-center"
        v-if="transportId"
    >
        <AutoNumber :number="
    formatTransportNumber(getTransportById(transportId))
        " />
    </div>
    <div v-else>Транспорт не выбран!</div>
</template>

<script>
import AutoNumber from 'src/components/base/AutoNumber.vue';
import { mapGetters } from 'vuex';
import { formatTransportNumber } from 'src/helpers/formatters';
export default {
    props: ['transportId'],
    components: {
        AutoNumber,
    },
    computed: {
        ...mapGetters('transport', ['getTransportById'])
    },
    methods: { formatTransportNumber }
}
</script>