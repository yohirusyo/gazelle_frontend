<template>
    <q-form
        @submit="onSubmit"
        @reset="resetForm"
        class="row q-gutter-x-md items-center q-gutter-y-md"
    >
        <q-select
            v-model="_owner"
            type="text"
            square
            outlined
            hide-bottom-space
            hide-hint
            dense
            label-color="grey"
            label="Ответственный"
            :options="emptyCustomers"
            :option-label="(item) => item.fullname"
            :option-value="(item) => item.id"
            clearable
            autocomplete="off"
            :class="$q.screen.xs ? 'col-11' : 'col-6'"
        />
        <q-input
            v-model="_monthPlanLimit"
            type="number"
            square
            outlined
            hide-bottom-space
            hide-hint
            dense
            label-color="grey"
            label="Ежемесячный лимит"
            autocomplete="off"
            class="col"
            lazy-rules
            :rules="[
                (val) => (val <= freeLimit && val >= 0) || `Введите число от 0 до ${freeLimit}`,
            ]"
        />
        <q-btn
            text-color="white"
            label="Добавить"
            unelevated
            class="border-none bg-blue-4 col"
            type="submit"
            no-caps
        />

    </q-form>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    computed: {
        ...mapState("customer", ["customers"]),
        ...mapGetters('hierarchy', ['freeLimit']),
        emptyCustomers: {
            get() {
                return this.customers.filter(c => c.managementId == null);
            }
        }
    },
    data() {
        return {
            _owner: null,
            _monthPlanLimit: 0,
        };
    },
    methods: {
        ...mapActions('hierarchy', ['addToMyHierarchy']),
        async onSubmit() {
            await this.addToMyHierarchy({
                ownerId: this._owner.id,
                monthPlanLimit: this._monthPlanLimit
            })
            this.resetForm();
        },
        resetForm() {
            this._owner = null;
            this._monthPlanLimit = 0;
        },
    }
}
</script>