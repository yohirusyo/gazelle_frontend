<template>
  <div
    class="full-height containertable"
    style="overflow-x: auto; overflow-y: hidden"
  >
    <q-resize-observer @resize="onResize" />
    <q-table
      :rows="rows"
      :columns="columns"
      :row-key="rowKey ?? 'id'"
      wrap-cells
      :virtual-scroll="!report"
      :rows-per-page-options="[0]"
      hide-bottom
      class="my-sticky-header-table table-inner"
      :style="`height: ${height}px; `"
      :class="report ? 'report-table' : ''"
      ref="scroll"
      flat
      dense
      table-header-class="bg-white"
      square
      separator="cell"
      :sort-method="sortMethod"
      binary-state-sort
      :selection="report ? 'multiple' : null"
      v-model:selected="selected"
      :selected-rows-label="getSelectedString"
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  props: ["rows", "rowKey", "columns", "sortMethod", "ref", "report"],
  data() {
    return {
      height: 0,
      selected: [],
    };
  },
  methods: {
    onResize(size) {
      this.height = 0;
      this.$nextTick(() => (this.height = size.height));
    },
    scrollTo(scrollTo) {
      this.$refs.scroll.scrollTo(scrollTo);
    },
    getSelectedString() {
      return `${this.selected.length}`;
    },
  },
};
</script>

<style>
.containertable {
  position: relative;
}
.table-inner {
  position: absolute;
  width: 100%;
}

.containertable::-webkit-scrollbar {
  display: none;
}

.report-table {
  width: max-content !important;
  min-width: 100% !important;
}
</style>
