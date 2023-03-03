<template>
    <div class="q-my-lg">
        Среднемесячный расход ({{ isMinutes? 'мин': 'км' }}. в смену)
        <div class="row q-gutter-x-md text-center q-mt-md">
            <div class="col used-limit q-pa-md row items-center border-sm">
                <span
                    class="col"
                    :class="$q.screen.xs ? '' : 'text-h4'"
                > {{ averageUsed.toFixed(0) }}</span>
                <span class="col"> {{ averageUsedLimit }}</span>
            </div>
            <div class="col unused-limit q-pa-md row items-center border-sm">
                <span
                    class="col "
                    :class="$q.screen.xs ? '' : 'text-h4'"
                > {{ averageUnused.toFixed(0) }}</span>
                <span class="col"> {{ averageUnusedLimit }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import * as moment from 'moment';
export default {
    props: ['isMinutes', 'used', 'unused', 'today'],
    data() {
        return {
            todayDate: moment().date(),
            // todayDate: 10,
            daysAfter: 0,
        };
    },
    mounted() {
        this.daysAfter = (moment().endOf('month').date() - this.todayDate) || 1;
        // this.daysAfter = 7;
    },
    computed: {
        averageUsed: {
            get() {
                return this.used / this.todayDate;
            }
        },
        averageUsedLimit: {
            get() {
                if (this.averageUsed == 0) return '- %'
                return `${((this.today / this.averageUsed) * 100).toFixed(1)}%`;
            }
        },
        averageUnused: {
            get() {
                return this.unused / this.daysAfter;
            }
        },
        averageUnusedLimit: {
            get() {
                if (this.averageUnused == 0) return '- %'
                return `${((this.today / this.averageUnused) * 100).toFixed(1)}%`;
            }
        },
    }
}
</script>