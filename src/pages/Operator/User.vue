<template>
  <q-page
    class="row items-stretch"
    v-if="!$q.screen.xs"
  >
    <div class="col-12 row justify-center">
      <div class="col col-8 bg-white q-pa-md column">
        <User :col="12" />
      </div>
    </div>
  </q-page>
  <q-page
    class="column"
    v-else
  >
    <div class="col bg-white column">
      <User :col="12" />
    </div>
  </q-page>
</template>

<script>
import User from "src/components/user/UserComponent.vue";

export default {
  name: "UserPage",
  components: {
    User,
  },
};
</script>

<style lang="scss" scoped>

</style>
