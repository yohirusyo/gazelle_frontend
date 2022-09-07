<template>
  <q-form @submit="onAddPlace" @reset="resetForm" class="col column justify-between" ref="form">
    <q-input v-model="_name" type="text" borderless class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
      hide-bottom-space hide-hint label-color="grey" label="Введите название места назначения" lazy-rules
      :rules="[(val) => (val !== null && val !== '') || 'Обязательное поле!']" />
    <q-btn text-color="white" label="Создать" unelevated class="border-sm shadow-white col col-shrink" color="primary"
      type="submit" />
  </q-form>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "PlaceCreation",
  computed: {
    ...mapState("current", ["coords"]),
  },
  methods: {
    ...mapActions("place", ["addPlace"]),
    ...mapMutations("current", ["clearCoords"]),
    async onAddPlace() {
      await this.addPlace({
        name: this._name,
        latitude: this.coords?.[0],
        longitude: this.coords?.[1],
      });
      this.$emit("done");
      this.$refs.form.reset();
    },
    resetForm() {
      this._name = null;
      this.clearCoords();
    },
  },
  data() {
    return {
      _name: null,
    };
  },
};
</script>

<style>
</style>
