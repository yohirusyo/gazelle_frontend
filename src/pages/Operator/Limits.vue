<template>
    <q-page
        class="row items-stretch"
        v-if="!$q.screen.xs"
    >
        <div class="col-12 row justify-center">
            <div class="col col-8 bg-white column">
                <Limits />
            </div>
        </div>
    </q-page>
    <q-page
        class=" bg-white "
        v-else
        style="overflow-y: auto;"
    >
        <Limits />
    </q-page>
</template>

<script>
import Limits from 'src/components/limits/Limits.vue';
// import dayjs from 'dayjs';
// import 'dayjs-weekday-calc';
export default {
    name: "LimitsPage",
    components: {
        Limits
    },

    // mounted() {
    //     const startmonth = dayjs().startOf('month');
    //     const endmonth = dayjs().endOf('month')
    //     const dates = dayjs().dateRangeToDates({
    //         rangeStart: [startmonth.year(), startmonth.month(), startmonth.date()],
    //         rangeEnd: [endmonth.year(), endmonth.month(), endmonth.date()],
    //         weekdays: [1, 2, 3, 4, 5]
    //     })
    //     console.warn({ startmonth: [startmonth.year(), startmonth.month(), startmonth.date()], endmonth: [endmonth.year(), endmonth.month(), endmonth.date()], dates });
    // },
};
</script>

<style lang="scss" scoped>

</style>
