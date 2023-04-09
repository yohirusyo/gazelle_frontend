<template>
  <q-page
    class="row items-stretch"
    v-if="!$q.screen.xs"
  >
    <div class="col-12 row justify-center">
      <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <Customer :col="12" />
        </BaseCard>
      </div>
      <div class="col col-6 bg-white q-pa-md column">
        <Driver :col="12" />
      </div>
    </div>
  </q-page>
  <q-page
    class="column"
    v-else
  >
    <div class="col bg-white column">
      <Driver :col="12" />
    </div>
  </q-page>
</template>

<script>
import Driver from "src/components/driver/DriverComponent.vue";
import BaseCard from "src/components/base/Card.vue";
import Customer from "src/components/customer/CustomerComponent.vue";
export default {
  name: "DriverPage",
  components: {
    Driver,
    Customer,
    BaseCard
  },
};
</script>

<style lang="scss" scoped>

</style>
