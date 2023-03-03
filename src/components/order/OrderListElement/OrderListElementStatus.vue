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
import * as moment from "moment";
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
            const start = moment(this.statusChangedAt);
            const diff = moment().diff(start);
            if (
                moment.duration(diff).asMinutes() >= 15 &&
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
