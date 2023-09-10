<template>
  <q-page class="row justify-center">
    <div class="image-container" v-if="!$q.screen.xs && currentUser?.role == 'CUSTOMER'">
      <q-img src="map.png" class="fullscreen-image"></q-img>
    </div>
    <div class="image-container" v-if="$q.screen.xs">
      <q-img  v-if="currentUser?.role == 'CUSTOMER'" src="map.png" ></q-img>
    </div>
    <YaMap v-if="currentUser?.role !== 'CUSTOMER'" />
  </q-page>
</template>
<script>
import YaMap from "src/components/map/YaMap.vue";
import { mapState } from "vuex";

export default {
  name: "MapPage",
  components: {
    YaMap
  },
  computed: {
    ...mapState("current", ["currentUser"]),
  },

};
</script>

<style lang="scss" scoped>
.image-container {
  width: 90%;
  height: 100%;
}

.fullscreen-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .fullscreen-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .image-container {
    width: 100%;
    height: auto;
    /* height: 100%; */
  }
}
</style>
