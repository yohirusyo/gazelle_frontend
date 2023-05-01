<template>
    <q-chip
        class="text-wrap "
        :class="_isFreeMoreThan15Minutes ? 'bg-green text-white' : ''"
        v-if="!isDone"
    >
        {{ getStatusById(statusId)?.description }}
    </q-chip>
    <div v-else>
        Завершен
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
    timeFormat,
    formatDriver,
    formatPlace,
} from "src/helpers/formatters";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
export default {
    name: "OrderStatus",
    props: ["statusId", 'statusChangedAt', 'isDone'],
    computed: {
        ...mapGetters("status", ["getStatusById"]),
    },
    methods: {
        timeFormat,
        formatDriver,
        formatPlace,
        updateStatus() {
            const start = dayjs(this.statusChangedAt);
            const diff = dayjs().diff(start);
            if (
                dayjs.duration(diff).asMinutes() >= 15 &&
                this.getStatusById(this.statusId)?.code == "FREE"
            ) {
                this._isFreeMoreThan15Minutes = true;
            } else {
                this._isFreeMoreThan15Minutes = false;
            }
        },
    },
    data() {
        return {
            _isFreeMoreThan15Minutes: false,
            oldStatus: null,
        };
    },
    mounted() {
        this.updateStatus();
        setInterval(() => {
            if (
                this.oldStatus != this.statusId &&
                this.statusId != null
            )
                this.updateStatus();
        }, 1000);
    },
};
</script>

<style lang="scss" scoped>

</style>
