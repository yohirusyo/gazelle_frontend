<template>
  <div class="row items-center col col-shrink q-pr-md" ref="top">
    <div class="col-12">Название</div>
  </div>
  <q-separator class="q-ma-none" />
  <q-virtual-scroll :items="places" separator v-slot="{ item }" :style="`height: ${height}px`">
    <div :key="item.id" @click="setPlace(place)">
      <div class="row items-center q-py-md">
        <div class="col-12">{{ item.name }}</div>
      </div>
      <q-separator class="q-ma-none" />
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
  props: ['col'],
  data() {
    return {
      height: 0,
    };
  },
  methods: {
    ...mapMutations("current", ["setPlace"]),
  },
  async mounted() {
    this.height =
      (document.getElementsByClassName("q-page")[0]?.clientHeight / 12 * this.col) - this.$refs.top.clientHeight - 98;
  },
};
</script>

<style>

</style>
