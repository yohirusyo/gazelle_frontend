<template>
  <div class="col column">
    <div class="row justify-between items-center">
      <div class="text-h5 text-center">Карта</div>
    </div>
    <q-separator spaced />
    <div class="col column">
      <yandex-map
        :coords="initialCoords"
        class="col"
        :settings="settings"
        :zoom="16"
        @click="setCoordsFromMap"
      >
        <ymap-marker
          :marker-id="p.id"
          :coords="[p.latitude, p.longitude]"
          :icon="getPlaceIcon(p.name)"
          v-for="(p, index) of places.filter(p => p.latitude && p.longitude)"
          :key="index"
          @click.prevent="setPlace(p)"
          :options="place && p.id == place.id ? { preset: 'islands#redStretchyIcon' } : {}"
        />
        <ymap-marker
          marker-id="now"
          :coords="coords"
          v-if="coords"
          @click="clearCoords"
        />
      </yandex-map>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { yandexMap, ymapMarker } from "vue-yandex-maps";

export default {
  name: "YaMap",
  components: {
    yandexMap,
    ymapMarker,
  },
  data() {
    return {
      settings: {
        apiKey: "aa7ef1f5-5697-4212-a688-0d67ca0fbef1",
        lang: "ru_RU",
        coordorder: "latlong",
        enterprise: false,
        version: "2.1",
      },
      initialCoords: [53.415471, 59.053397],
    };
  },
  computed: {
    ...mapState("place", ["places"]),
    ...mapState("current", ["coords", "place"]),
  },
  methods: {
    ...mapMutations("current", ["setCoords", "setPlace", "clearCoords"]),
    getPlaceIcon(name) {
      return {
        content: name,
        contentLayout:
          '<div style="background: red; width: 50px; color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>',
      };
    },
    setCoordsFromMap(e) {
      if (e.originalEvent) {
        this.setCoords(e.get("coords"));
      }
    },
    // addMarker(e) {
    //   if (e.originalEvent) {
    //     this.$q.dialog({
    //       component: PlaceCreationDialog,
    //       componentProps: {
    //         coords: e.get("coords"),
    //       },
    //     });
    //   }
    // },
  },
};
</script>

<style></style>
