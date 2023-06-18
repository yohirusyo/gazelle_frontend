<template>
  <q-checkbox v-model="_withCargo" label="Груз" dense />

  <div class="column items-stretch" v-if="_withCargo">
    <div class="row q-gutter-x-md">
      <ISelect
        :options="_names"
        v-model="_name"
        :labelFn="(item) => item.name"
        label="Наименование груза"
        @selected="(val) => (_name = val?.name)"
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
        :rules="[(val) => (val !== null && val !== '') || 'Обязательное поле!']"
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
        :rules="[(val) => (val !== null && val !== '') || 'Обязательное поле!']"
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
        :rules="[(val) => (val !== null && val !== '') || 'Обязательное поле!']"
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
        :rules="[(val) => (val !== null && val !== '') || 'Обязательное поле!']"
        autocomplete="off"
        class="col"
      />
    </div>
  </div>
</template>

<script>
import ISelect from "components/base/ISelect.vue";
import { mapState } from "vuex";
import { getConnection } from "src/boot/axios";
export default {
  props: ["modelValue", "withoutPassengers"],
  data() {
    return {
      additionalNames: [
        "Катанка, круг, прокат горячекатаный в бунтах (сырье)",
        "Круг, прокат горячекатаный в прутках (сырье)",
        "Квадрат, прокат горячекатаный в прутках (сырье)",
        "Шестигранник, прокат горячекатаный в прутках (сырье)",
        "Лист холоднокатаный (сырье)",
        "Проволока на якорях (полуфабрикат)",
        "Проволока в мотках (полуфабрикат)",
        "Проволока на катушке (полуфабрикат)",
        "Сердечник для каната на деревянных барабанах (полуфабрикат)",
        "Полоса холоднокатаная в пачке (полуфабрикат)",
        "Баллоны с газом (кислород, пропан, аргон, азот, аммиак, углекислота)",
        "Кислота техническая (серная, соляная) в пластиковом кубе",
        "Материалы для обеспечения технологического процесса (химикаты, цветной металл, смазки, масла, охлаждающие жидкости, технологический инструмент, бумага)",
        "Материалы вспомогательные (СИЗы, хоз инвентарь, упаковочные материалы, строительные материалы, запасные части, инструмент, электротовары, средства пожаротушения, мебель)",
        "Якоря пустые",
        "Катушки пустые",
        "Коробки с крепежом, гвоздями на паллете (готовая продукция)",
        "Розетты проволоки (готовая продукция)",
        "Прокат в мотках (В500С) (готовая продукция)",
        "Бухта омедненной проволоки на паллете (готовая продукция)",
        "Стальная проволока в мотках (готовая продукция)",
        "Арматурный канат в бухтах (готовая продукция)",
        "Канаты стальные на деревянных барабанах (готовая продукция)",
        "Строп в пачке (готовая продукция)",
        "Проволока в большегрузных мотках/бухтах (готовая продукция)",
        "Проволока СТАП на деревянных барабанах (готовая продукция)",
        "Сетка металлическая в картах (готовая продукция)",
        "Прокат калиброванный в пачке (готовая продукция)",
        "Бухты на якорях, в раме (перевозка на отжиг в ЛПЦ 8)",
        "Металлоотходы/металлолом в контейнерах",
        "Отходы деревянных паллет",
        "Металлоотходы в бухтах",
      ],
    };
  },
  methods: {
    buildName(name) {
      return { name };
    },
  },
  computed: {
    ...mapState("order", ["names"]),
    _modelValue: {
      get() {
        return this.modelValue;
      },
    },
    _names: {
      get() {
        if (getConnection() == "mmkmetiz")
          return [...this.additionalNames.map(this.buildName), ...this.names];
        return this.names;
      },
    },
    _withCargo: {
      get() {
        return this.modelValue.withCargo;
      },
      set(val) {
        this.$emit("update:modelValue", { ...this.modelValue, withCargo: val });
      },
    },
    _name: {
      get() {
        return this.modelValue.name;
      },
      set(val) {
        this.$emit("update:modelValue", { ...this.modelValue, name: val });
      },
    },
    _weight: {
      get() {
        return this.modelValue.weight;
      },
      set(val) {
        this.$emit("update:modelValue", { ...this.modelValue, weight: val });
      },
    },
    _width: {
      get() {
        return this.modelValue.width;
      },
      set(val) {
        this.$emit("update:modelValue", { ...this.modelValue, width: val });
      },
    },
    _length: {
      get() {
        return this.modelValue.length;
      },
      set(val) {
        this.$emit("update:modelValue", { ...this.modelValue, length: val });
      },
    },
    _height: {
      get() {
        return this.modelValue.height;
      },
      set(val) {
        this.$emit("update:modelValue", { ...this.modelValue, height: val });
      },
    },
  },
  components: {
    ISelect,
  },
};
</script>
