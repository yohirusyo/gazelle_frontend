<template>
  <q-table
    :rows="drivers"
    :columns="columns"
    row-key="time"
    virtual-scroll
    :rows-per-page-options="[0]"
    hide-bottom
    :style="`height: ${height}px`"
    ref="scroll"
    wrap-cells
    flat
    class="my-sticky-header-table"
    dense
    table-header-class="bg-white"
    square
    separator="cell"
  >
    <template v-slot:body="props">
      <q-tr :props="props" @click="setDriver(props.row)" class="text-center">
        <q-td key="fullname" :props="props" class="pre">
          {{ `${props.row.surname} ${props.row.name} ${props.row.middlename}` }}
        </q-td>
        <q-td key="phoneNumber" :props="props">
          {{ props.row.workingPhoneNumber }}
        </q-td>
        <q-td
          key="isOnDriverShift"
          :props="props"
          :class="
            props.row.isOnDriverShift && version != props.row.version
              ? 'text-red'
              : ''
          "
        >
          {{
            props.row.isOnDriverShift
              ? `Да (Версия: ${props.row.version ?? "1.1.0 или ниже"})`
              : "Нет"
          }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "DriverList",
  props: ["col", "height"],
  computed: {
    ...mapState("user", ["drivers"]),
  },
  methods: {
    ...mapMutations("current", ["setDriver"]),
  },
  async mounted() {
    this.version = "1.1.3";
  },
  data() {
    return {
      version: null,
      columns: [
        {
          name: "fullname",
          required: true,
          label: "ФИО",
          align: "center",
          sortable: false,
        },
        {
          name: "phoneNumber",
          required: true,
          label: "Номер телефона",
          align: "center",
          sortable: false,
        },
        {
          name: "isOnDriverShift",
          required: false,
          label: "На смене",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
};
</script>

<style></style>
