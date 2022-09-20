<template>
  <div class="col column">
    <div class="row justify-between items-center">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="main" label="Места назначения" no-caps />
        <q-tab name="create" label="Создание" no-caps  />
        <q-tab name="edit" label="Редактирование" no-caps :disable="place == null" />
      </q-tabs>
    </div>
    <q-separator spaced />
    <q-tab-panels v-model="tab" animated class="col" keep-alive>
      <q-tab-panel name="main" class="col column">
        <PlaceList :col="col"/>
      </q-tab-panel>

      <q-tab-panel name="create" class="col column">
        <PlaceCreation @done="onDone" />
      </q-tab-panel>

      <q-tab-panel name="edit" class="col column">
        <PlaceEdit @done="onDone" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import PlaceList from "./PlaceList.vue";
import PlaceCreation from "./PlaceCreation.vue";
import PlaceEdit from "./PlaceEdit.vue";
import { mapState } from "vuex";
export default {
  name: "Place",
  components: {
    PlaceList,
    PlaceCreation,
    PlaceEdit,
  },
  props: ['col'],
  computed: {
    ...mapState("current", ["place"]),
  },
  methods: {
    onDone() {
      this.tab = "main";
    },
  },
  data() {
    return {
      tab: "main",
    };
  },
  watch: {
    place(newPlace) {
      if (!!newPlace) {
        this.tab = "edit";
      }
    },
  },
};
</script>

<style></style>
