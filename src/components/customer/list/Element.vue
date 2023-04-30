<template>
  <q-tr @click="onSelected(customer)" class="text-center">
    <q-td key="subdivision">
      {{ customer?.subdivision }}
    </q-td>
    <q-td key="fullname">{{ customer?.fullname }}</q-td>
    <q-td key="phoneNumber">{{ customer?.phoneNumber }}</q-td>
    <q-td key="management">{{ customer?.name ?? '-' }}</q-td>
    <q-td key="limit">{{ limit }}</q-td>
  </q-tr>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "CustomerListElement",

  props: ["id"],
  computed: {
    ...mapGetters("customer", ["getCustomerById"]),
    customer: {
      get() {
        return this.getCustomerById(this.id);
      },
    },
    limit: {
      get() {
        if (!!this.customer.monthPlanLimit) {
          return `${this.customer?.monthUsed.toFixed(2)} / ${this.customer?.monthFactLimit.toFixed(2)} ( ${this.customer?.monthPlanLimit.toFixed(2)} ) ${this.customer.isMinutes ? 'мин' : 'км'}`;
        }
        return "-";
      },
    },
  },
  methods: {
    onSelected(sel) {
      this.$emit("onSelected", sel);
    },
  },
};
</script>

<style></style>
