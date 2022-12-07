<template>


  <!-- <yandex-map
        :coords="initialCoords"
        class="col"
        :settings="settings"
        :zoom="16"
        @click="setCoordsFromMap"
      > -->
  <yandex-map
    :coords="initialCoords"
    class="fit"
    :settings="settings"
    :zoom="13"
  >
    <ymap-marker
      :marker-id="p.id + '-place'"
      :coords="[p.latitude, p.longitude]"
      :icon="getPlaceIcon(p.name)"
      v-for="(p, index) of places.filter((p) => p.latitude && p.longitude)"
      :key="index"
      @click.prevent="setPlace(p)"
      :options="
        place && p.id == place.id
          ? { preset: 'islands#redStretchyIcon' }
          : {}
      "
    />
    <ymap-marker
      :marker-id="t.id + '-transport'"
      :coords="[t.latitude, t.longitude]"
      v-for="(t, index) of getByOnlyFreeFilter(
        false,
        true,
        freeStatuses.map((s) => s.id)
      ).filter((p) => p.latitude && p.longitude)"
      :key="index"
      :icon="getTransportContentLayout(t)"
    />
    <ymap-marker
      marker-id="now"
      :coords="coords"
      v-if="coords"
      @click="clearCoords"
    />
  </yandex-map>

</template>

<script>
import { mapMutations, mapState, mapGetters } from "vuex";
import { yandexMap, ymapMarker } from "vue-yandex-maps";
import { formatDriverMobileFullname } from "src/helpers/formatters";
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
    ...mapGetters("transport", ["getByOnlyFreeFilter"]),
    ...mapState("current", ["coords", "place"]),
    ...mapState("status", ["statuses"]),
    ...mapGetters("user", ["getDriverById"]),
    ...mapGetters("status", ["getStatusById"]),
    freeStatuses: {
      get() {
        return this.statuses.filter((s) => s.isBusy == false);
      },
    },
  },
  methods: {
    ...mapMutations("current", ["setCoords", "setPlace", "clearCoords"]),
    formatDriverMobileFullname,
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
    parseNumber(number) {
      if (
        !/[ETYOPAHKXCBM]{1}\s{0,1}\d{3}\s{0,1}[ETYOPAHKXCBM]{2}\s{0,1}\d{2,3}/.test(
          number
        )
      )
        return;
      number = number.replace(/\s+/g, "");
      return [
        number.substring(0, 1),
        number.substring(1, 4),
        number.substring(4, 6),
        number.substring(6),
      ];
    },
    getTransportContentLayout(t) {
      const _parsedNumber = this.parseNumber(t.transportNumber);

      return {
        layout: "default#imageWithContent",
        content: t.transportNumber,
        imageHref: "https://image.flaticon.com/icons/png/512/33/33447.png",
        // imageSize: [0, 0],
        // imageOffset: [0, 0],
        // contentOffset: [0, 0],
        contentLayout: `<div style="position: relative;">
        <div style="position: absolute; top: 50%; left: 50%; width: max-content; display: flex; align-items: flex-end; transform: scale(0.5) translate(-50%, -50%);">
          <i style="paddind-bottom: 2px; margin-right: 4px; color: ${this.freeStatuses.map((s) => s.id).includes(t.statusId)
            ? "green"
            : "red"
          }" class="la-2x las la-truck-moving"></i>
          
          <div style="    display: flex;
    flex-wrap: wrap; "><div style="background-color: black;
              border-radius: 6px;
              padding: 2px;
              font-size: 1.6rem;
              font-family: RoadNumbers2;
              gap: 2px;
              line-height: 12px;
              position: relative;
              display: flex;
              flex-wrap: nowrap;" 
        >
      <div style="  position: absolute;
  top: 0;   right: 3px;" >.</div>
      <div style="  position: absolute;
  top: 0;   left: 3px;" >.</div>
      <div style="  background-color: white;
  border-radius: 4px;
  padding-top: 4px;
  padding-left: 4px;
  padding-right: 6px;
  padding-left: 8px;
  padding-right: 6px;
  letter-spacing: 2px;
  display: flex;
              flex-wrap: nowrap;
              width: auto;
    min-width: 0;
    max-width: 100%;
    flex: 0 1 auto;
">
        <div >${_parsedNumber?.[0]}</div>
        <div>${_parsedNumber?.[1]}</div>
        <div >${_parsedNumber?.[2]}</div>
      </div>
      <div
      style="  background-color: white;
  border-radius: 4px;
  padding-top: 4px;
  padding-left: 4px;
  padding-right: 6px;
  width: auto;
    min-width: 0;
    max-width: 100%;
    flex: 0 1 auto;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;"
      >
        <div style="  font-size: 1.4rem;
  transform: translateY(-45%); padding-right: 4px;" >${_parsedNumber?.[3]}</div>
        <div style="align-items: center; flex-wrap: nowrap;     display: flex;
" class="row items-center no-wrap">
          <div style="  color: black !important;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.6rem;">RUS</div>
          <img style="  width: 10px;
  object-fit: contain;
  margin-left: 2px;" src="flag-of-russia.png" />
        </div>
      </div>
    </div></div></div>
        
        </div>`,
      };
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

<style lang="scss" scoped>

</style>
