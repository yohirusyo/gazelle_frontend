<template>
  <q-page class="column justify-beetwen bg-white">
    <div class="column bg-white">
      <q-select
        :options="limitMonths"
        v-model="_selectedMonth"
        label="Месяц"
        square
        outlined
        dense
        @update:model-value="(val) => updateData(val)"
        :option-label="(item) => monthLabel(item)"
        class="col text-black border-none q-pa-sm"
      />
      <div v-if="_selectedMonth">
        <div class="row">
          <q-input
            label="Плановый объем производства"
            class="col text-black border-none q-pa-sm"
            square
            outlined
            dense
            hide-bottom-space
            hide-hint
            v-model="_productionPlanVolume"
          />
          <q-input
            label="Фактичесий объем производства"
            class="col text-black border-none q-pa-sm"
            square
            outlined
            dense
            hide-bottom-space
            hide-hint
            v-model="_productionFactVolume"
          />
        </div>
        <div class="row">
          <q-input
          label="Реализация по часам"
          class="col text-black border-none q-pa-sm"
          square
          outlined
          dense
          hide-bottom-space
          hide-hint
          v-model="_realizationByHours"
        />
          <q-input
            readonly
            label="Плановая абонентская плата"
            class="col text-black border-none q-pa-sm"
            square
            outlined
            dense
            hide-bottom-space
            hide-hint
            v-model="_planSubPay"
          />
          <q-input
            readonly
            label="Итоговая абонентская плата"
            class="col text-black border-none q-pa-sm"
            square
            outlined
            dense
            hide-bottom-space
            hide-hint
            v-model="_factSubPay"
          />

        </div>
        <LimitTable
          :plan="_productionPlanVolume"
          :year="year"
          :month="month"
        ></LimitTable>
      </div>
    </div>
    <div class="row q-ma-sm absolute-bottom">
      <q-btn
        v-if="_selectedMonth"
        @click="saveData"
        text-color="white"
        label="Сохранить"
        unelevated
        class="border-none bg-blue-4 col"
        type="submit"
        no-caps
        dense
      />
    </div>
    <div class="text-center text-h6" v-if="_selectedMonth">
      Счет-реестр автоуслуг по управлению снабжения
    </div>
    <div class="row" v-if="_selectedMonth">
      <LimitReport
        class="col-6"
        :year="year"
        :month="month"
        :cost="oneKilometrCost"
      />
      <div class="col-6">
        <q-input
          label='Итоговая скидка для ОАО "ММК МЕТИЗ"'
          class="col text-black border-none q-pa-sm"
          square
          outlined
          dense
          hide-bottom-space
          hide-hint
          v-model="_discount"
        />
        <q-input
          readonly
          label="Абонентская плата без УС"
          class="col text-black border-none q-pa-sm"
          square
          outlined
          dense
          hide-bottom-space
          hide-hint
          v-model="_hoursCost"
        />
        <q-input
          readonly
          label='Итоговая прибыль ООО "Автотранспортное управление"'
          class="col text-black border-none q-pa-sm"
          square
          outlined
          dense
          hide-bottom-space
          hide-hint
          v-model="_finalPropfit"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import LimitTable from "./LimitTable.vue";
import LimitReport from "./LimitReport.vue";
import { mapActions, mapState } from "vuex";
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import localizedFormat from "dayjs/plugin/localizedFormat";
import _ from "lodash";

dayjs.extend(localizedFormat);
dayjs.extend(objectSupport);

export default {
  name: "limit-page",
  components: {
    LimitTable,
    LimitReport,
  },
  data() {
    return {
      month: null,
      year: null,
      _selectedMonth: null,
      _productionPlanVolume: null,
      _discount: null,
      _productionFactVolume: null,
      _realizationByHours: null,
    };
  },
  methods: {
    ...mapActions("limit", [
      "getAllControlLimits",
      "postMonthLimit",
      "postEditControl",
      "getMonthLimitSubdivisions",
      "getStatsContorlLimits",
      "getHoursStatsContorlLimits",
    ]),
    updateData(item) {
      this.getMonthLimitSubdivisions({ year: item.year, month: item.month });
      this.getHoursStatsContorlLimits({ year: item.year, month: item.month });
      this._productionPlanVolume = item.productionPlanVolume;
      this._productionFactVolume = item.productionFactVolume;
      this._realizationByHours = item.realizationByHours;
      this._discount = item.discount;
      this.month = item.month;
      this.year = item.year;
    },
    saveData() {
      this.postMonthLimit({
        year: this.year,
        month: this.month,
        data: this.monthLimitSubdivisions,
      });
      this.postEditControl({
        data: {
          productionPlanVolume: this._productionPlanVolume,
          productionFactVolume: this._productionFactVolume,
          realizationByHours: this._realizationByHours,
          discount: this._discount,
        },
        month: this.month,
        year: this.year,
      });
    },
    monthLabel(item) {
      return _.capitalize(
        dayjs({ year: item.year, month: item.month })
          .locale("ru")
          .format("MMMM YYYY")
      );
    },
  },
  async mounted() {
    this.getAllControlLimits();
  },
  computed: {
    ...mapState("limit", [
      "controlLimits",
      "monthLimitSubdivisions",
      "statsHoursControl",
    ]),
    limitMonths: {
      get() {
        return this.controlLimits;
      },
    },
    _planSubPay: {
      get() {
        return (
          (this._productionPlanVolume * 290 + 6709000) *
          ((100 - this._discount) / 100)
        );
      },
    },
    _factSubPay: {
      get() {
        return (
          (this._productionFactVolume * 290 + 6709000) *
          ((100 - this._discount) / 100)
        );
      },
    },
    _finalPropfit: {
      get() {
        return (this._factSubPay - this._realizationByHours)?.toFixed(2);
      },
    },
    _hoursCost: {
      get() {
        return (
          this._factSubPay -
          this.statsHoursControl * this.oneKilometrCost
        ).toFixed(2);
      },
    },
    oneKilometrCost: {
      get() {
        return (
          this._planSubPay /
          this.monthLimitSubdivisions.find(
            (item) => item.management.name == "УС"
          )?.fact
        );
      },
    },
  },
};
</script>
