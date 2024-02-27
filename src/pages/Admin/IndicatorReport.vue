<template>
  <q-page class="bg-black text-white row justify-center items-center">
    {{ indicatorStats }}

  <q-select
        label="Выберите месяц"
        square
        outlined
        dense
        @update:model-value="(val) => updateData(val)"
        :option-label="(item) => monthLabel(item)"
        class="col text-black border-none q-pa-sm"
      />
  </q-page>

</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      chechil: "Чечил",
      year: 2024,
      month: 0
    };
  },

  mounted() {
    this.getStatsIndicatorReport({ year: this.year, month: this.month });
  },
  methods: {
    ...mapActions("orderStats", ["getStatsIndicatorReport"]),
  },
  computed: {
    ...mapState("orderStats", ["indicatorStats"]),
    chechilFeedback: {
      get() {
        return this.chechil + " Чечеенец";
      },
    },
  },
  name: "indicator-report",
};
</script>

<style scoped>
.q-btn--outline:before {
  border: 1px solid rgba(0, 0, 0, 0.24);
}
</style>
