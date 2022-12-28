<template>
  <q-dialog ref="dialog" @hide="onDialogHide" full-height full-width>
    <div class="q-pa-md bg-white">
      <yandex-map
        :coords="initialCoords"
        class="fit"
        :settings="settings"
        :zoom="13"
        ref="map"
        @map-was-initialized="kek"
        @click.stop
      >
        <ymap-marker
          marker-id="start"
          :coords="coordinates[0]"
          :icon="{ content: getPlaceById(_order.departurePointId).name }"
        />
        <ymap-marker
          marker-id="end"
          :coords="coordinates[coordinates.length - 1]"
          :icon="{ content: getPlaceById(_order.destinationId).name }"
          v-if="notDone == false || notDone == null"
        />
        <ymap-marker
          :marker-id="getTransportById(_order.transportId)?.id + '-transport'"
          :coords="[
            getTransportById(_order.transportId)?.latitude,
            getTransportById(_order.transportId)?.longitude,
          ]"
          :icon="
            getTransportContentLayout(getTransportById(_order.transportId))
          "
          v-if="getTransportById(_order.transportId) && notDone == true"
        />
      </yandex-map>
    </div>
  </q-dialog>
</template>

<script>
import { yandexMap, ymapMarker, loadYmap } from "vue-yandex-maps";
import { mapGetters, mapState } from "vuex";
export default {
  name: "MapOrder",
  props: {
    order: {
      type: Object,
      required: true,
    },
    notDone: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("transport", ["getTransportById"]),
    ...mapState("status", ["statuses"]),
    ...mapGetters("order", ["getOrderById"]),
    freeStatuses: {
      get() {
        return this.statuses.filter((s) => s.isBusy == false);
      },
    },
    _order: {
      get() {
        return this.getOrderById(this.order.id) == null
          ? this.order
          : this.getOrderById(this.order.id);
      },
    },
    coordinates: {
      get() {
        return this._order.coordinatesHistory
          .map((h) => JSON.parse(h))
          .sort(
            (a, b) =>
              new Date(a.coordinatesChangedAt) -
              new Date(b.coordinatesChangedAt)
          )
          .map((h) => [h.latitude, h.longitude]);
      },
    },
  },
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
  methods: {
    onDialogHide() {
      this.hide();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    show() {
      this.$refs.dialog.show();
    },
    onCancelClick() {
      this.onCancel();
      this.hide();
    },
    onOkClick() {
      this.onOk();
      this.hide();
    },
    async kek(ll) {
      this.mapInstance = ll;
      await loadYmap(this.settings);
      var polyline = new ymaps.Polyline(
        this.coordinates,
        {
          hintContent:
            this._order.routeLength != null && this._order.routeLength != 0
              ? `${(this._order.routeLength / 1000).toFixed(1)}км`
              : "Расстояние будет доступно после поездки",
        },
        {
          strokeColor: "#1E98FF",
          strokeWidth: 2,
        }
      );
      this.mapInstance.geoObjects.add(polyline);
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
        imageHref: "",
        // imageSize: [0, 0],
        // imageOffset: [0, 0],
        // contentOffset: [0, 0],
        contentLayout: `<div style="position: relative;">
        <div style="position: absolute; top: 50%; left: 50%; width: max-content; display: flex; align-items: flex-end; transform: scale(0.5) translate(-50%, -50%);">
          <i style="paddind-bottom: 2px; margin-right: 4px; color: ${
            this.freeStatuses.map((s) => s.id).includes(t.statusId)
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
  },
};
</script>

<style></style>
