<template>
  <q-form
    @submit="onUpdateTransport"
    @reset="resetForm"
    class="col column justify-between"
    ref="form"
  >
    <div class="col row q-mb-md">
      <q-scroll-area class="col">
        <div class="column q-gutter-y-md">
          <q-input
            v-model="_type"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Введите тип ТС"
            :autocomplete="false"
          />
          <q-input
            v-model="_transportNumber"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Введите номер ТС"
            mask="A ### AA ###"
            :autocomplete="false"
          />
          <q-select
            v-model="_place"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Выберите местонахождение транспорта"
            :options="places"
            :option-label="(item) => item.name"
            :option-value="(item) => item.id"
            clearable
            :autocomplete="false"
          >
            <template v-slot:append>
              <q-btn
                color="primary"
                icon="las la-map-marker"
                flat
                rounded
                class="q-ml-sm"
                :disable="!place"
                @click.stop="
                  () => {
                    _place = place;
                    setPlace(null);
                  }
                "
              />
            </template>
          </q-select>
          <q-select
            v-model="_driver"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Выберите водителя"
            :options="drivers"
            :option-label="
              (item) =>
                `${item.surname} ${item.name} ${item.middlename} (${item.phoneNumber})`
            "
            :option-value="(item) => item.id"
            clearable
            :autocomplete="false"
          />
        </div>
      </q-scroll-area>
    </div>
    <div class="row">
      <q-btn
        text-color="white"
        label="Изменить"
        unelevated
        class="border-sm shadow-white col q-mr-md"
        color="primary"
        type="submit"
      />
      <q-btn
        text-color="white"
        label="Удалить"
        unelevated
        class="border-sm shadow-white col col-shrink"
        color="red"
        @click="onRemoveTransport"
      />
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";

export default {
  name: "TransportEdit",
  computed: {
    ...mapState("current", ["coords", "transport", "place"]),
    ...mapState("place", ["places"]),
    ...mapState("user", ["drivers"]),
    ...mapGetters("user", ["getDriverById"]),
    ...mapGetters("place", ["getPlaceById"]),
  },
  methods: {
    ...mapActions("transport", ["updateTransport", "removeTransport"]),
    ...mapMutations("current", ["clearCoords", "clearTransport", "setPlace"]),

    async onUpdateTransport() {
      this.$emit("done");
      await this.updateTransport({
        id: this.transport.id,
        type: this._type,
        transportNumber: this._transportNumber,
        placeId: this._place?.id || null,
        driverId: this._driver?.id || null,
      });
      this.$refs.form.reset();
    },
    async onRemoveTransport() {
      this.$emit("done");
      await this.removeTransport({ id: this.transport.id });
      this.$refs.form.reset();
    },
    resetForm() {
      this._name = null;
      this.clearTransport();
    },
  },
  data() {
    return {
      _type: null,
      _transportNumber: null,
      _place: null,
      _driver: null,
    };
  },
  mounted() {
    this._type = this.transport.type;
    this._transportNumber = this.transport.transportNumber;
    this._place = this.getPlaceById(this.transport.placeId);
    this._driver = this.getDriverById(this.transport.driverId);
  },
  watch: {
    "transport.type"() {
      if (this.transport) {
        this._type = this.transport.type;
        this._transportNumber = this.transport.transportNumber;
        this._place = this.getPlaceById(this.transport.placeId);
        this._driver = this.getDriverById(this.transport.driverId);
      }
    },
  },
};
</script>

<style></style>
