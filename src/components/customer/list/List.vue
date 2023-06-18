<template>
  <VScrolltable :rows="customers" :columns="columns" row-key="id">
    <template v-slot:body="props">
      <CustomerListElement :id="props.row.id" @onSelected="onSelected" />
    </template>
  </VScrolltable>
</template>

<script>
import { mapState } from "vuex";
import CustomerListElement from "./Element.vue";
import VScrolltable from "src/components/base/VScrolltable.vue";
export default {
  name: "CustomerList",
  components: {
    CustomerListElement,
    VScrolltable,
  },
  props: ["height", "selected"],
  methods: {
    onSelected(sel) {
      this.$emit("onSelected", sel);
    },
  },
  computed: {
    ...mapState("customer", ["customers"]),
  },
  data() {
    return {
      columns: [
        {
          name: "subdivision",
          required: true,
          label: "Подразделение",
          align: "center",
          sortable: false,
        },
        {
          name: "fullname",
          required: true,
          label: "Ответственный",
          align: "center",
          sortable: false,
        },
        {
          name: "phoneNumber",
          required: true,
          label: "Телефон",
          align: "center",
          sortable: false,
        },
        {
          name: "managementName",
          required: true,
          label: "Управление",
          align: "center",
          sortable: false,
        },
        {
          name: "limit",
          required: true,
          label: "Лимиты",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
};
</script>

<style></style>
