<template>
  <q-page class="row items-stretch">
    <div class="col row">
      <div class="col-6 row">
        <div
          class="col col-12 bg-white q-pa-md column"
          style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
        >
          <Customer />
        </div>
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
import Customer from "src/components/customer/Component.vue";
import ManagementComponent from "src/components/management/ManagementComponent.vue";
import { mapActions } from "vuex";
import { Loading } from "quasar";
export default {
  name: "PageAdmin",
  components: {
    Customer,
    ManagementComponent,
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

<style lang="scss" scoped></style>
