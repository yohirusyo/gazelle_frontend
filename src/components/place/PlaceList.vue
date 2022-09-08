<template>
  <div class="row items-center col col-shrink q-pr-md" ref="top">
    <div class="col-12">Название</div>
  </div>
  <q-separator spaced />
  <q-virtual-scroll
    :items="places"
    separator
    v-slot="{ item }"
    :style="`height: ${height}px`"
  >
    <div :key="item.id" @click="setPlace(place)">
      <div class="row items-center">
        <div class="col-12">{{ item.name }}</div>
      </div>
      <q-separator spaced inset />
    </div>
  </q-virtual-scroll>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "PlaceList",
  computed: {
    ...mapState("place", ["places"]),
  },
  data() {
    return {
      height: 0,
    };
  },
  methods: {
    ...mapActions("place", ["requestPlaces"]),
    ...mapMutations("current", ["setPlace"]),
  },
  async mounted() {
    await this.requestPlaces();
    this.height =
      document.getElementsByClassName("ymap-container")[0]?.clientHeight - this.$refs.top.clientHeight - 25;
  },
};
</script>

<style></style>
