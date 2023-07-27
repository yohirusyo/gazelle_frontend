<template>
  <q-tr :props="props">
    <q-td key="ownerId" :props="props">
      {{ getCustomerById(props.row?.ownerId)?.fullname }}
    </q-td>
    <q-td key="percentage" :props="props">
      {{ percentage }}
    </q-td>
    <q-td key="monthPlanLimit" :props="props">
      <q-form
        @submit="onSubmit"
        @reset="resetForm"
        class="row items-start"
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
      <div v-else class="col-3">{{ updateValue }}</div>
    </q-td>
    <q-td key="departurePoint" :props="props">
      {{ props.row?.dayLimitUsed.toFixed(2) }}</q-td
    >
  </q-tr>
  <q-tr v-if="filteredRequests.length != 0">
    <q-td colspan="4">
      <div class="col column bg-red">
        <div>Запросы на пополнение</div>
        <div v-for="request in filteredRequests">
          <LimitApprovement :item="request" :isAdmin="false" class="q-my-sm" />
        </div>
      </div>
    </q-td>
  </q-tr>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["props"],
  data() {
    return {
      updateValue: this.props.row.monthFactLimit,
    };
  },
  methods: {
    ...mapActions("hierarchy", ["updateHierarchy"]),
    async onSubmit() {
      await this.updateHierarchy({
        ownerId: this.props.row?.ownerId,
        monthPlanLimit: this.updateValue,
      });
    },
    resetForm() {},
  },
  computed: {
    ...mapGetters("customer", ["getCustomerById"]),
    ...mapGetters("hierarchy", ["myHierarchy"]),
    ...mapGetters("hierarchy", ["freeLimit"]),
    percentage: {
      get() {
        return `${(
          (this.props.row.dayLimitUsed / this.myHierarchy.monthFactLimit) *
          100
        ).toFixed(2)} %`;
      },
    },
    filteredRequests: {
      get() {
        return (
          this.props.row?.requests?.filter(
            (item) => !item.approved && !item.declined
          ) || []
        );
      },
    },
  },
};
</script>
