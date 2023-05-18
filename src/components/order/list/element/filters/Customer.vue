<template>
  <q-btn icon="las la-filter" size="0.7rem" dense flat>
    <q-menu persistent>
      <q-list style="min-width: 100px">
        <q-item
          style="user-select: none"
          clickable
          v-for="customer of customers"
          :key="customer.id"
          :class="isSelected(customer.id) ? 'bg-blue-2' : ''"
          @click="
            isSelected(customer.id)
              ? removeFromSelectedSubdivisions(customer.id)
              : addToSelectedSubdivisions(customer.id)
          "
        >
          <q-item-section
            >{{ customer.fullname }} ({{
              customer.subdivision
            }})</q-item-section
          >
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  computed: {
    ...mapGetters("order", ["ordersCustomers"]),
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapState("order", ["selectedCustomers"]),
    customers: {
      get() {
        return Array.from(
          new Set([...this.ordersCustomers, ...this.selectedCustomers])
        )
          .map((id) => ({
            id,
            fullname: this.getCustomerById(id)?.fullname,
            subdivision: this.getCustomerById(id)?.subdivision,
          }))
          .sort((a, b) => {
            return `${a.subdivision}${a.fullname}`.localeCompare(
              `${b.subdivision}${b.fullname}`
            );
          });
      },
    },
  },
  methods: {
    isSelected(customerId) {
      return this.selectedCustomers.includes(customerId);
    },
    ...mapMutations("order", [
      "addToSelectedSubdivisions",
      "removeFromSelectedSubdivisions",
    ]),
  },
};
</script>
