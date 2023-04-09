<template>
  <q-page class="row items-stretch">
    <div class="col row">
      <div class="col-6 row q-pa-xs">
        <BaseCard class="col bg-white q-pa-md column">
          <Customer :col="12" />
        </BaseCard>
      </div>
      <div class="col-6 row justify-center">
        <div class="col col-12 bg-white q-pa-md column">
          <ManagementComponent />
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import BaseCard from "src/components/base/Card.vue";
import Customer from "src/components/customer/CustomerComponent.vue";
import ManagementComponent from "src/components/management/ManagementComponent.vue";
import { mapActions } from "vuex";
import { Loading } from "quasar";
export default {
  name: "PageAdmin",
  components: {
    BaseCard,
    Customer,
    ManagementComponent
  },
  methods: {
    ...mapActions("status", ["requestStatuses"]),
  },
  async mounted() {
    Loading.show();
    await this.requestStatuses();
    Loading.hide();
  },
};
</script>

<style lang="scss" scoped>

</style>
