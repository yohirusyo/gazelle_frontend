<template>
  <div class="column items-center">
    <div class="row">
      {{ formatCustomerMobileFullname(getCustomerById(customerId)) }}

      {{ formatCustomerMobileSubdivision(getCustomerById(customerId)) }}
    </div>
    <div class="row text-grey items-center">
      <q-icon name="phone" />
      {{ formatCustomerMobilePhoneNumber(getCustomerById(customerId)) }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  formatCustomerMobileFullname,
  formatCustomerMobileSubdivision,
  formatCustomerMobilePhoneNumber,
} from "src/helpers/formatters";
export default {
  props: ["customerId"],
  computed: {
    ...mapGetters("customer", ["getCustomerById"]),
  },
  methods: {
    formatCustomerMobileFullname,
    formatCustomerMobileSubdivision,
    formatCustomerMobilePhoneNumber,
  },
};
</script>
