<template>
    
    <q-form
        @submit="onSubmit"
        @reset="resetForm"
        class="row q-gutter-x-md items-center"
    >
        <q-input
            v-model="_amount"
            type="number"
            square
            outlined
            hide-bottom-space
            hide-hint
            dense
            label-color="grey"
            label="Запросить дополнительный лимит"
            autocomplete="off"
            class="col-8"
        />
        <q-btn
            text-color="white"
            label="Запросить"
            unelevated
            class="border-none bg-blue-4 col"
            type="submit"
            no-caps
        />

    </q-form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions('hierarchy', ['requestLimit']),
        async onSubmit() {
            await this.requestLimit({
                amount: this._amount,
            })
            this.resetForm();
        },
        resetForm() {
            this._amount = null;
        }
    },
    data() {
        return {
            _amount: null,
        }
    }
}
</script>