<template>
  <q-form
    @submit="onUpdatePlace"
    @reset="resetForm"
    class="col column justify-between"
    ref="form"
  >
    <div class="column">
      <q-input
        v-model="_name"
        type="text"
        borderless
        class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
        hide-bottom-space
        hide-hint
        label-color="grey"
        label="Введите название места назначения"
        lazy-rules
        :rules="[(val) => (val !== null && val !== '') || 'Обязательное поле!']"
        :autocomplete="false"
      />
      <q-checkbox
        v-model="_changeCoords"
        label="Переместить на выбранное местоположение?"
        class="q-pt-md"
        :disable="coords == null"
      />
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
        @click="onRemovePlace"
      />
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "PlaceEdit",
  computed: {
    ...mapState("current", ["coords", "place"]),
  },
  methods: {
    ...mapActions("place", ["updatePlace", "removePlace"]),
    ...mapMutations("current", ["clearCoords", "clearPlace"]),
    async onUpdatePlace() {
      const updateData = {
        id: this.place.id,
        name: this._name,
      };
      if (this._changeCoords && this.coords) {
        updateData["latitude"] = this.coords[0];
        updateData["longitude"] = this.coords[1];
      }
      this.$emit("done");
      await this.updatePlace(updateData);
      this.$refs.form.reset();
    },
    async onRemovePlace() {
      this.$emit("done");
      await this.removePlace({ id: this.place.id });
      this.$refs.form.reset();
    },
    resetForm() {
      this._name = null;
      this.clearCoords();
      this.clearPlace();
    },
  },
  data() {
    return {
      _name: null,
      _changeCoords: false,
    };
  },
  mounted() {
    this._name = this.place.name;
  },
  watch: {
    "place.name"() {
      if (this.place) this._name = this.place.name;
    },
  },
};
</script>

<style></style>
