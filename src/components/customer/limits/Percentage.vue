<template>
    <div
        class="column "
        :class="$q.screen.xs? '' : 'text-h6'"
    >
        <div class="text-right q-pr-md q-mb-xs">
            {{ myManagement?.isMinutes? 'Минуты': 'Километры' }}
        </div>
        <div class="row month-limit q-py-sm q-px-md q-mb-sm limit-unit items-center">
            <div class="col-6">
                Лимит на месяц
            </div>
            <div class="col-3 text-right">
                {{ monthLimitPercentage }}
            </div>
            <div class="col-3 text-right">
                {{ myManagement?.limits[0]?.fact }}
            </div>
        </div>

        <div class="row used-limit q-py-sm q-px-md limit-unit items-center">
            <div class="col-6">
                Израсходованно
            </div>
            <div class="col-3 text-right">
                {{ usedLimitPercentage }}
            </div>
            <div class="col-3 text-right">
                {{ myHierarchy?.monthUsed }}
            </div>
        </div>

        <div class="row q-ml-xl today-limit q-py-sm q-px-md q-mb-sm limit-unit items-center">
            <div class="col-9">
                Сегодня
            </div>
            <div class="col-3 text-right">
                {{ myManagement?.limits[0]?.daylimits[0]?.used }}
            </div>
        </div>

        <div class="row unused-limit q-py-sm q-px-md limit-unit items-center">
            <div class="col-6">
                Остаток
            </div>
            <div class="col-3 text-right">
                {{ unusedLimitPercentage }}
            </div>
            <div class="col-3 text-right">
                {{ unusedLimit }}
            </div>
        </div>

        <Average
            :isMinutes="myManagement?.isMinutes"
            :used="myHierarchy?.monthUsed"
            :unused="unusedLimit"
            :today="myHierarchy?.dayLimitUsed"
        />
    </div>
</template>

<script>
import Average from './Average.vue';
import { mapGetters } from 'vuex'
export default {
    components: {
        Average
    },
    data() {
        return {
            isMinutes: true
        }
    },
    computed: {
        monthLimitPercentage: {
            get() {
                return `${((this.myHierarchy?.monthFactLimit / this.myHierarchy?.monthPlanLimit) * 100).toFixed(1)}%`;
            }
        },
        usedLimitPercentage: {
            get() {
                return `${((this.myHierarchy?.monthUsed / this.myHierarchy?.monthPlanLimit) * 100).toFixed(1)}%`;
            }
        },
        unusedLimit: {
            get() {
                return this.myHierarchy?.monthFactLimit - this.myHierarchy?.monthUsed;
            }
        },
        unusedLimitPercentage: {
            get() {
                return `${((this.unusedLimit / this.myHierarchy?.monthPlanLimit) * 100).toFixed(1)}%`;
            }
        },
        ...mapGetters('management', ['myManagement']),
        ...mapGetters('hierarchy', ['myHierarchy']),
    },
}
</script>

<style>
.limit-unit {
    height: 48px;
}
</style>