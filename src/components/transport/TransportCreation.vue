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
            <q-select
              square
              outlined
              hide-bottom-space
              hide-hint
              class="fit col"
              dense
              flat
              :options="transportTypes"
              :option-label="(item) => item.description"
              :option-value="(item) => item.id"
              v-model="_transportType"
              label="Тип ТС"
            ></q-select>
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
          <div class="column items-stretch q-mt-md">
            <div class="row q-gutter-x-md">
              <q-input
                v-model="_weight"
                type="number"
                :min="0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Вес (кг)"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
                class="col"
              />
              <q-input
                v-model="_length"
                type="number"
                :min="0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Длина (мм)"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
                class="col"
              />
            </div>
            <div class="row q-mt-md q-gutter-x-md">
              <q-input
                v-model="_width"
                type="number"
                :min="0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Ширина (мм)"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
                class="col"
              />
              <q-input
                v-model="_height"
                type="number"
                :min="0"
                square
                outlined
                dense
                hide-bottom-space
                hide-hint
                label-color="grey"
                label="Высота (мм)"
                lazy-rules
                :rules="[
                  (val) => (val !== null && val !== '') || 'Обязательное поле!',
                ]"
                autocomplete="off"
                class="col"
              />
            </div>
            <q-checkbox
              v-if="shortConnectionName() != 'ММК-МЕТИЗ'"
              v-model="_isLocal"
              :label="`Транспорт ${shortConnectionName()}`"
              dense
              class="q-pa-md"
            />
            <div
              class="q-pa-sm"
              v-if="shortConnectionName() == 'ММК-МЕТИЗ'"
            ></div>
            <q-input
              v-model="_agGUID"
              square
              outlined
              dense
              hide-bottom-space
              hide-hint
              label-color="grey"
              label="Идентификатор Автограф (GUID)"
              autocomplete="off"
              class="col"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Обязательное поле!',
              ]"
            />
          </div>
        </q-scroll-area>
      </div>
      <div class="row q-gutter-x-md">
        <q-btn
          v-if="_creationMode && !currentUser?.role.includes('WATCHER')"
          text-color="white"
          label="Создать"
          unelevated
          class="border-none bg-blue-4 col"
          type="submit"
          no-caps
        />
        <q-btn
          v-if="!_creationMode && !currentUser?.role.includes('WATCHER')"
          text-color="white"
          label="Изменить"
          unelevated
          class="border-none bg-blue-4 col"
          type="submit"
          no-caps
        />
        <q-btn
          v-if="!_creationMode && !currentUser?.role.includes('WATCHER')"
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
import { shortConnectionName } from "src/helpers/formatters";
export default {
  name: "TransportCreation",
  props: ["height", "selected", "transportTypes"],
  computed: {
    ...mapState("current", ["place", "currentUser"]),
    ...mapState("place", ["places"]),
    ...mapState("user", ["drivers"]),
    ...mapGetters("user", ["getDriverById"]),
    ...mapGetters("place", ["getPlaceById"]),
    ...mapGetters("status", ["getStatusByCode"]),
    _transportTypeId: {
      get() {
        return this._transportType?.id;
      },
      set(val) {
        this._transportType = this.transportTypes.find((tt) => tt.id === val);
      },
    },
  },
  methods: {
    ...mapActions("transport", [
      "updateTransport",
      "removeTransport",
      "addTransport",
    ]),
    ...mapMutations("current", ["clearTransport", "setPlace"]),
    async onAddTransport() {
      await this.addTransport({
        // type: this._type,
        transportTypeId: this._transportTypeId,
        transportNumber: this._transportNumber,
        placeId: this._place?.id,
        statusId: this.getStatusByCode("FREE").id,
        driverId: this._driver?.id,
        width: Number(this._width),
        weight: Number(this._weight),
        length: Number(this._length),
        height: Number(this._height),
        isLocal: this._isLocal,
        agGUID: this._agGUID,
      });
      this.$refs.form.reset();
    },
    async onUpdateTransport() {
      await this.updateTransport({
        id: this.selected.id,
        // type: this._type,
        transportTypeId: this._transportTypeId,
        transportNumber: this._transportNumber,
        placeId: this._place?.id || null,
        driverId: this._driver?.id || null,
        width: Number(this._width),
        weight: Number(this._weight),
        length: Number(this._length),
        height: Number(this._height),
        isLocal: this._isLocal,
        agGUID: this._agGUID,
      });
      this.$refs.form.reset();
    },
    async onSubmit() {
      this._creationMode
        ? await this.onAddTransport()
        : await this.onUpdateTransport();
    },
    async onRemoveTransport() {
      await this.removeTransport({ id: this.selected.id });
      this.$refs.form.reset();
    },
    resetForm() {
      // this._type = null;
      this._transportTypeId = null;
      this._transportNumber = null;
      this._place = null;
      this._driver = null;
      this._width = 0;
      this._weight = 0;
      this._height = 0;
      this._length = 0;
      this._isLocal = false;
      this._agGUID = null;
      this.$emit("done");
      this.clearTransport();
    },
    loadData() {
      if (this.selected) {
        // this._type = this.selected.type;
        this._transportTypeId = this.selected.transportTypeId;
        this._transportNumber = this.selected.transportNumber;
        this._place = this.getPlaceById(this.selected.placeId);
        this._driver = this.getDriverById(this.selected.driverId);
        this._width = Number(this.selected.width);
        this._weight = Number(this.selected.weight);
        this._height = Number(this.selected.height);
        this._length = Number(this.selected.length);
        this._isLocal = this.selected.isLocal;
        this._agGUID = this.selected.agGUID;
        this._creationMode = false;
      } else {
        this._creationMode = true;
      }
    },
    onCancel() {
      this.resetForm();
    },
    shortConnectionName,
  },
  data() {
    return {
      // _type: null,
      _transportType: null,
      _transportNumber: null,
      _place: null,
      _driver: null,
      _width: 0,
      _height: 0,
      _weight: 0,
      _length: 0,
      _isLocal: false,
      _agGUID: null,
      _creationMode: true,
    };
  },
  mounted() {
    this.loadData();
  },
  watch: {
    selected: {
      handler(newVal, oldVal) {
        this._creationMode = !newVal;
        if (newVal != oldVal) this.loadData();
      },
    },
  },
};
</script>

<style></style>
