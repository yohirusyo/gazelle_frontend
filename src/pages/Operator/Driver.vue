<template>
  <q-page class="row items-stretch" v-if="!$q.screen.xs">
    <div class="col-12 row justify-center">
      <div class="col col-8 bg-white q-pa-md column">
        <Driver :col="12" />
      </div>
    </div>
  </q-page>
  <q-page class="column" v-else>
    <div class="col bg-white column">
      <Driver :col="12" />
    </div>
  </q-page>
</template>

<script>
import Driver from "src/components/driver/DriverComponent.vue";
export default {
  name: "DriverPage",
  components: {
    Driver,
  },
};
</script>

<style lang="scss" scoped></style>
