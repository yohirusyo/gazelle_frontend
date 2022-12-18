<template>
  <div class="col column">
    <q-form
      @submit="onSubmit"
      @reset="resetForm"
      class="col column justify-between q-pa-md"
      ref="form"
    >
      <div class="col row q-mb-md">
        <q-scroll-area class="col">
          <div class="column q-gutter-y-md">
            <q-input
              v-model="_type"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Введите тип ТС"
              autocomplete="off"
            />
            <q-input
              v-model="_transportNumber"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Введите номер ТС"
              mask="A ### AA ###"
              autocomplete="off"
            />
            <q-select
              v-model="_place"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Выберите местонахождение транспорта"
              :options="places"
              :option-label="(item) => item.name"
              :option-value="(item) => item.id"
              clearable
              autocomplete="off"
            />
            <q-select
              v-model="_driver"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Выберите водителя"
              :options="drivers"
              :option-label="
                (item) =>
                  `${item.surname} ${item.name} ${item.middlename} (${item.phoneNumber})`
              "
              :option-value="(item) => item.id"
              clearable
              autocomplete="off"
            />
          </div>
        </q-scroll-area>
      </div>
      <div class="row q-gutter-x-md">
        <q-btn
          v-if="_creationMode"
          text-color="white"
          label="Создать"
          unelevated
          class="border-none bg-blue-4 col"
          type="submit"
          no-caps
        />
        <q-btn
          v-if="!_creationMode"
          text-color="white"
          label="Изменить"
          unelevated
          class="border-none bg-blue-4 col"
          type="submit"
          no-caps
        />
        <q-btn
          v-if="!_creationMode"
          text-color="white"
          label="Удалить"
          unelevated
          class="border-none bg-red col"
          @click="onRemoveTransport"
          no-caps
        />
        <q-btn
          text-color="white"
          label="Отмена"
          unelevated
          class="border-none bg-green col"
          @click="onCancel()"
          no-caps
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";

export default {
  name: "TransportCreation",
  props: ["height"],
  computed: {
    ...mapState("current", ["coords", "transport", "place"]),
    ...mapState("place", ["places"]),
    ...mapState("user", ["drivers"]),
    ...mapGetters("user", ["getDriverById"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("status", ["getStatusByCode"]),
  },
  methods: {
    ...mapActions("transport", [
      "updateTransport",
      "removeTransport",
      "addTransport",
    ]),
    ...mapMutations("current", ["clearCoords", "clearTransport", "setPlace"]),
    async onAddTransport() {
      await this.addTransport({
        type: this._type,
        transportNumber: this._transportNumber,
        placeId: this._place?.id,
        statusId: this.getStatusByCode("FREE").id,
        driverId: this._driver?.id,
      });
      this.$refs.form.reset();
    },
    async onUpdateTransport() {
      await this.updateTransport({
        id: this.transport.id,
        type: this._type,
        transportNumber: this._transportNumber,
        placeId: this._place?.id || null,
        driverId: this._driver?.id || null,
      });
      this.$refs.form.reset();
    },
    async onSubmit() {
      this._creationMode
        ? await this.onAddTransport()
        : await this.onUpdateTransport();
    },
    async onRemoveTransport() {
      await this.removeTransport({ id: this.transport.id });
      this.$refs.form.reset();
    },
    resetForm() {
      this._type = null;
      this._transportNumber = null;
      this._place = null;
      this._driver = null;
      this.$emit("done");
      this.clearTransport();
    },
    loadData() {
      if (this.transport) {
        this._type = this.transport.type;
        this._transportNumber = this.transport.transportNumber;
        this._place = this.getPlaceById(this.transport.placeId);
        this._driver = this.getDriverById(this.transport.driverId);
        this._creationMode = false;
      } else {
        this._creationMode = true;
      }
    },
    onCancel() {
      this.$refs.form.reset();
    },
  },
  data() {
    return {
      _type: null,
      _transportNumber: null,
      _place: null,
      _driver: null,
      _creationMode: true,
    };
  },
  mounted() {
    this.loadData();
  },
  watch: {
    "transport.type"() {
      if (this.transport) this.loadData();
    },
    transport() {
      this._creationMode = !this.transport;
    },
  },
};
</script>

<style></style>
