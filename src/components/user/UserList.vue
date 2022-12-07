<template>
  <q-table
    :rows="users"
    :columns="columns"
    row-key="time"
    virtual-scroll
    :rows-per-page-options="[0]"
    hide-bottom
    style="height: 100%"
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
      <q-tr :props="props" @click="setUser(props.row)" class="text-center">
        <q-td key="fullname" :props="props" class="pre">
          {{ `${props.row.surname} ${props.row.name} ${props.row.middlename}` }}
        </q-td>
        <q-td key="phoneNumber" :props="props">
          {{ props.row.workingPhoneNumber }}
        </q-td>
        <q-td key="role" :props="props">
          {{ formatRole(props.row.role) }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { formatRole } from "src/helpers/formatters.js";
export default {
  name: "UserList",
  props: ["col", "height"],
  computed: {
    ...mapState("user", ["users"]),
  },
  methods: {
    ...mapMutations("current", ["setUser"]),
    formatRole,
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
          name: "role",
          required: false,
          label: "Роль",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
};
</script>

<style></style>
