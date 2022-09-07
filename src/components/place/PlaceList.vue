<template>
  <div class="row items-center col col-shrink q-pr-md">
    <div class="col-12">Название</div>
  </div>
  <q-separator spaced />

  <!-- <q-virtual-scroll :items="places" separator v-slot="{ item, index }">
    <div :key="item.id" @click="setPlace(place)">
      <div class="row items-center">
        <div class="col-12">{{ item.name }}</div>
      </div>
      <q-separator spaced inset />
    </div>
  </q-virtual-scroll> -->


  <q-scroll-area class="col q-pr-md">
    <div v-for="place in places" :key="place.id" @click="setPlace(place)">
      <div class="row items-center">
        <div class="col-12">{{ place.name }}</div>
      </div>
      <q-separator spaced inset />
    </div>
  </q-scroll-area>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "PlaceList",
  computed: {
    ...mapState("place", ["places"]),
  },
  methods: {
    ...mapActions("place", ["requestPlaces"]),
    ...mapMutations("current", ["setPlace"]),
  },
  async mounted() {
    await this.requestPlaces();
  },
};
</script>

<style>
</style>
