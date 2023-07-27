<template>
  <q-chip v-if="!!limit"  :label="'Осталось ' + limit + '% лимита'" class="bg-red text-white " />
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("management", ["limitWarning"]),
    limit: {
      get() {
        return this.limitWarning(10);
      },
    },
  },
};
</script>
