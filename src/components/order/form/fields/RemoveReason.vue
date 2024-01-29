<template>
    <q-input
        v-model="_modelValue"
        type="text"
        square
        outlined
        dense
        hide-bottom-space
        hide-hint
        label-color="grey"
        label="Укажите причину удаления"
        autocomplete="off"
        :rules="
        removeReason
        ? [(val) => (val !== null && val !== '') || 'Обязательное поле!']
        : []
    "
    />
</template>

<script>

export default {
    props: ['modelValue', 'label', 'removeReason'],
    computed: {
        _modelValue: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit("update:modelValue", val);
            }
        },
    },
    // aria-required="true"

}
</script>
