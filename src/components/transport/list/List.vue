<template>
  <VScrolltable
    :rows="_transports"
    :columns="currentUser?.role.includes('WATCHER') ? watchercolumns : columns"
    row-key="id"
    :sortMethod="customSort"
  >
    <template v-slot:header-cell-type="props">
      <q-th :props="props">
        {{ props.col.label }}
        <TypeFilter v-model="typeFilter" :transportTypes="transportTypes" />
      </q-th>
    </template>
    <template v-slot:header-cell-number="props">
      <q-th :props="props">
        {{ props.col.label }}
        <TransportNumberFilter v-model="numberFilter" />
      </q-th>
    </template>
    <template v-slot:header-cell-driver="props">
      <q-th :props="props">
        {{ props.col.label }} ({{ _transports.length }}/{{
          _allTransportsLength
        }})
        <DriverFilter v-model="driverFilter" />
      </q-th>
    </template>
    <template v-slot:body="props">
      <TransportListElement
        :id="props.row.id"
        :freeStatuses="freeStatuses"
        @onSelected="onSelected"
        :transportTypes="transportTypes"
      />
    </template>
  </VScrolltable>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import TransportListElement from "./element/Element.vue";
import TypeFilter from "./element/filters/Type.vue";
import TransportNumberFilter from "./element/filters/TransportNumber.vue";
import DriverFilter from "./element/filters/Driver.vue";
import VScrolltable from "src/components/base/VScrolltable.vue";
export default {
  name: "TransportList",
  components: {
    TransportListElement,
    TransportNumberFilter,
    TypeFilter,
    DriverFilter,
    VScrolltable,
  },
  props: ["col", "height", "selected", "isLocal", "transportTypes"],
  methods: {
    onSelected(sel) {
      this.$emit("onSelected", sel);
    },
    getTransportTypeById(id) {
      return this.transportTypes.find((t) => t.id === id)?.description ?? null;
    },
    customSort(rows, sortBy, descending) {
      const data = [...rows];
      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a;
          const y = descending ? a : b;
          if (sortBy === "type") {
            const xTT = this.getTransportTypeById(x.transportTypeId);
            const yTT = this.getTransportTypeById(y.transportTypeId);
            return yTT > xTT ? 1 : xTT > yTT ? -1 : 0;
          } else if (sortBy == "number") {
            const numberX = parseInt(
              x.transportNumber.replace(/\s+/g, "").substring(1, 4)
            );
            const numberY = parseInt(
              y.transportNumber.replace(/\s+/g, "").substring(1, 4)
            );
            return numberX > numberY ? 1 : numberX < numberY ? -1 : 0;
          } else if (sortBy == "driver") {
            const driverX = x.driver
              ? `${x.driver.surname} ${x.driver.name} ${x.driver.middlename}`
              : null;
            const driverY = y.driver
              ? `${y.driver.surname} ${y.driver.name} ${y.driver.middlename}`
              : null;
            if (driverX == null && driverY == null) return 0;
            if (driverX == null) return 1;
            if (driverY == null) return -1;
            return driverX > driverY ? 1 : driverY > driverX ? -1 : 0;
          } else if (sortBy == "status") {
            const statusX = this.getStatusById(x.statusId).globalOrder;
            const statusY = this.getStatusById(y.statusId).globalOrder;
            return statusX > statusY ? 1 : statusY > statusX ? -1 : 0;
          }
        });
      }

      return data;
    },
  },
  data() {
    return {
      typeFilter: [],
      numberFilter: [],
      driverFilter: [],
      watchercolumns: [
        {
          name: "type",
          required: true,
          label: "Тип ТС",
          align: "center",
          sortable: true,
        },
        {
          name: "number",
          required: true,
          label: "Номер ТС",
          align: "center",
          sortable: true,
        },
        {
          name: "driver",
          required: false,
          label: "Водитель",
          align: "center",
          sortable: true,
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
          sortable: true,
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
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            console.warn(a, b, rowA, rowB);
          },
        },
        {
          name: "number",
          required: true,
          label: "Номер ТС",
          align: "center",
          sortable: true,
        },
        {
          name: "driver",
          required: false,
          label: "Водитель",
          align: "center",
          sortable: true,
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
          sortable: true,
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
    ...mapState("transport", ["transports"]),
    ...mapGetters("transport", ["getByOnlyFreeFilter"]),
    ...mapGetters("status", ["getStatusById"]),
    ...mapState("current", ["currentUser"]),
    freeStatuses: {
      get() {
        return this.statuses.filter((s) => s.isBusy == false);
      },
    },
    _allTransportsLength: {
      get() {
        return this.transports.filter((t) => t.isLocal == this.isLocal).length;
      },
    },
    _transports: {
      get() {
        var transport__ = this.getByOnlyFreeFilter(
          this.onlyFree,
          this.onlyWithDrivers,
          this.freeStatuses.map((s) => s.id),
          this.isLocal
        );
        if (this.typeFilter.length != 0)
          transport__ = transport__.filter((t) =>
            this.typeFilter.includes(t.transportTypeId)
          );
        if (this.numberFilter.length != 0)
          transport__ = transport__.filter((t) => {
            const number = t.transportNumber.replace(/\s+/g, "");
            return this.numberFilter.includes(number.substring(1, 4));
          });
        if (this.driverFilter.length != 0) {
          transport__ = transport__.filter((t) =>
            this.driverFilter.includes(t.driverId)
          );
        }
        return transport__;
      },
      set(val) {
        console.log(val);
      },
    },
  },
};
</script>

<style></style>
