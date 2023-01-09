<template>
  <q-table
    :rows="
      getByOnlyFreeFilter(
        onlyFree,
        onlyWithDrivers,
        freeStatuses.map((s) => s.id)
      )
    "
    :columns="currentUser?.role == 'WATCHER' ? watchercolumns : columns"
    row-key="id"
    wrap-cells
    virtual-scroll
    :rows-per-page-options="[0]"
    hide-bottom
    style="height: 100%"
    ref="scroll"
    flat
    class="my-sticky-header-table"
    dense
    table-header-class="bg-white"
    square
    separator="cell"

  >
    <template v-slot:body="props">
      <TransportListElement :id="props.row.id" :freeStatuses="freeStatuses" />
    </template>
  </q-table>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import TransportListElement from "./TransportListElement.vue";

export default {
  name: "TransportList",
  components: {
    TransportListElement,
  },
  props: ["col", "height"],
  
  data() {
    return {
      watchercolumns: [
        {
          name: "type",
          required: true,
          label: "Тип ТС",
          align: "center",
          sortable: false,
        },
        {
          name: "number",
          required: true,
          label: "Номер ТС",
          align: "center",
          sortable: false,
        },
        {
          name: "driver",
          required: false,
          label: "Водитель",
          align: "center",
          sortable: false,
        },
        {
          name: "place",
          required: true,
          label: "Место нахождения",
          align: "center",
          sortable: false,
        },
        {
          name: "status",
          required: true,
          label: "Статус",
          align: "center",
          sortable: false,
        },
        {
          name: "time",
          required: false,
          label: "В текущем статусе",
          align: "center",
          sortable: false,
        },
      ],
      columns: [
        {
          name: "select",
          required: true,
          label: "Выбрать",
          align: "center",
          sortable: false,
        },
        {
          name: "type",
          required: true,
          label: "Тип ТС",
          align: "center",
          sortable: false,
        },
        {
          name: "number",
          required: true,
          label: "Номер ТС",
          align: "center",
          sortable: false,
        },
        {
          name: "driver",
          required: false,
          label: "Водитель",
          align: "center",
          sortable: false,
        },
        {
          name: "place",
          required: true,
          label: "Место нахождения",
          align: "center",
          sortable: false,
        },
        {
          name: "status",
          required: true,
          label: "Статус",
          align: "center",
          sortable: false,
        },
        {
          name: "time",
          required: false,
          label: "В текущем статусе",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState("current", ["onlyFree", "onlyWithDrivers"]),
    ...mapState("status", ["statuses"]),
    ...mapGetters("transport", ["getByOnlyFreeFilter"]),
    ...mapGetters("status", ["getStatusById"]),
    ...mapGetters("user", ["getDriverById"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapState("current", ["currentUser"]),
    freeStatuses: {
      get() {
        return this.statuses.filter((s) => s.isBusy == false);
      },
    },
  },
};
</script>

<style></style>
