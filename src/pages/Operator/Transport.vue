<template>
  <q-page class="row items-stretch" v-if="!$q.screen.xs">
    Пока не готово (
  </q-page>
  <q-page class="column" v-else>
    <div class="col bg-white column">
      <Transport :col="12" />
    </div>
  </q-page>
</template>

<script>
import Transport from "src/components/transport/TransportComponent.vue";

export default {
  name: "TransportPage",
  components: {
    Transport,
  },
};
</script>

<style lang="scss" scoped></style>
