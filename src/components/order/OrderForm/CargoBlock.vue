<template>
    <q-checkbox
        v-model="_withCargo"
        label="Груз"
        dense
    />

    <div
        class="column items-stretch"
        v-if="_withCargo"
    >
        <div class="row q-gutter-x-md">
            <ISelect
                :options="names"
                v-model="_name"
                :labelFn="(item) => item.name"
                label="Наименование груза"
                @selected="(val) => (_name = val.name)"
                :required="true"
                class="q-mb-md"
            />
            <q-input
                v-model="_weight"
                type="number"
                :min="withoutPassengers ? 1 : 0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Вес (кг)"
                lazy-rules
                :rules="[
                    (val) =>
                        (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
                class="col"
            />
            <q-input
                v-model="_length"
                type="number"
                :min="withoutPassengers ? 1 : 0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Длина (мм)"
                lazy-rules
                :rules="[
                    (val) =>
                        (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
                class="col"
            />
        </div>
        <div class="row q-mt-md q-gutter-x-md">
            <q-input
                v-model="_width"
                type="number"
                :min="withoutPassengers ? 1 : 0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Ширина (мм)"
                lazy-rules
                :rules="[
                    (val) =>
                        (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
                class="col"
            />
            <q-input
                v-model="_height"
                type="number"
                :min="withoutPassengers ? 1 : 0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Высота (мм)"
                lazy-rules
                :rules="[
                    (val) =>
                        (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
                class="col"
            />
        </div>
    </div>
</template>

<script>
import ISelect from "components/base/ISelect.vue";
import OrderPlaceISelect from "./OrderPlaceISelect.vue";
import { mapState } from 'vuex';
export default {
    props: ['modelValue', "withoutPassengers"],
    computed: {
        ...mapState("order", ["names"]),
        _modelValue: {
            get() {
                return this.modelValue;
            },
        },
        _withCargo: {
            get() {
                return this.modelValue.withCargo;
            },
            set(val) {
                this.$emit("update:modelValue", { ...this.modelValue, withCargo: val })
            }
        },
        _name: {
            get() {
                return this.modelValue.name;
            },
            set(val) {
                this.$emit("update:modelValue", { ...this.modelValue, name: val })
            }
        },
        _weight: {
            get() {
                return this.modelValue.weight;
            },
            set(val) {
                this.$emit("update:modelValue", { ...this.modelValue, weight: val })
            }
        },
        _width: {
            get() {
                return this.modelValue.width;
            },
            set(val) {
                this.$emit("update:modelValue", { ...this.modelValue, width: val })
            }
        },
        _length: {
            get() {
                return this.modelValue.length;
            },
            set(val) {
                this.$emit("update:modelValue", { ...this.modelValue, length: val })
            }
        },
        _height: {
            get() {
                return this.modelValue.height;
            },
            set(val) {
                this.$emit("update:modelValue", { ...this.modelValue, height: val })
            }
        }
    },
    components: {
        ISelect,
        OrderPlaceISelect
    },
}
</script>