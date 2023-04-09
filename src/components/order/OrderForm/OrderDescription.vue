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
        label="Комментарий"
        autocomplete="off"
    />
</template>

<script>
export default {
    props: ['modelValue', 'label'],
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

}
</script>