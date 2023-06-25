<template>
  <div class="column">
    <div class="row items-center">
      <div class="col-6">{{ getCustomerById(item?.ownerId)?.fullname }}</div>
      <div class="col-1 text-center">{{ percentage }}</div>
      <q-form
        @submit="onSubmit"
        @reset="resetForm"
        class="col-3 row items-start q-mt-md"
        v-if="!myHierarchy?.isSubdivision"
      >
        <q-input
          v-model="updateValue"
          dense
          outlined
          class="col"
          lazy-rules
          :rules="[
            (val) =>
              (val <= freeLimit && val >= 0) ||
              `Введите число от 0 до ${freeLimit}`,
          ]"
        >
          <template v-slot:append>
            <q-btn
              flat
              dense
              unelevated
              class="cursor-pointer"
              icon="las la-check"
              @click="onSubmit"
            />
          </template>
        </q-input>
      </q-form>
      <div v-else class="col-3 ">{{ updateValue }}</div>
      <div class="col-2 text-center">{{ item?.dayLimitUsed }}</div>
    </div>
    <div class="col column q-mx-md" v-if="filteredRequests.length != 0">
      <div>Запросы на пополнение</div>
      <q-separator />
      <div v-for="request in filteredRequests">
        <LimitApprovement :item="request" :isAdmin="false" class="q-my-sm" />
      </div>
    </div>
    <q-separator />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LimitApprovement from "./LimitApprovement.vue";
export default {
  props: ["item"],
  data() {
    return {
      updateValue: this.item.monthFactLimit,
    };
  },
  methods: {
    ...mapActions("hierarchy", ["updateHierarchy"]),
    async onSubmit() {
      await this.updateHierarchy({
        ownerId: this.item?.ownerId,
        monthPlanLimit: this.updateValue,
      });
    },
    resetForm() {},
  },
  computed: {
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapGetters("hierarchy", ["myHierarchy"]),
    ...mapGetters("hierarchy", ["freeLimit"]),
    filteredRequests: {
      get() {
        return (
          this.item?.requests?.filter(
            (item) => !item.approved && !item.declined
          ) || []
        );
      },
    },
    percentage: {
      get() {
        return `${(
          (this.item.monthFactLimit / this.myHierarchy.monthFactLimit) *
          100
        ).toFixed(2)} %`;
      },
    },
  },
  components: {
    LimitApprovement,
  },
};
</script>
