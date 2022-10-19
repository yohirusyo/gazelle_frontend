<template>
  <div v-if="currentUser?.role == 'WATCHER'">
    <slot
      name="main"
      :height="height"
    />
  </div>
  <div
    class="col column full-height"
    v-else
  >
    <q-tabs
      v-model="tab"
      dense
      class="text-grey row justify-between full-width q-pa-sm col col-shrink"
      active-color="primary"
      indicator-color="transparent"
      narrow-indicator
    >
      <div class="row col justify-start">
        <q-tab
          name="main"
          :label="label"
          no-caps
          :ripple="false"
          style="border-radius: 8px"
        />
        <q-tab
          name="create"
          :label="!modelValue ? 'Создание' : 'Редактирование'"
          no-caps
          :ripple="false"
          style="border-radius: 8px"
        />
      </div>
      <div
        class="col row q-gutter-x-md"
        :class="$q.screen.xs ? 'justify-start' : 'justify-end'"
      >
        <slot name="menu" />
      </div>
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      animated
      class="col column"
      keep-alive
    >
      <q-tab-panel
        name="main"
        class="col column"
      >
        <slot
          name="main"
          :height="height"
        />
      </q-tab-panel>

      <q-tab-panel
        name="create"
        class="col column"
      >
        <slot
          name="create"
          :height="height"
          :onDone="onDone"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MenuItem",
  props: ["col", "label", "modelValue", "withoutRole"],
  computed: {
    ...mapState("current", ["currentUser"]),
  },
  data() {
    return {
      tab: "main",
      height: 0,
    };
  },
  methods: {

    async onDone() {
      this.tab = "main";
    },
  },
  async mounted() {
    this.height =
      (document.getElementsByClassName("q-page")[0]?.clientHeight / 12) *
      this.col -
      (this.currentUser?.role == "WATCHER" ? 41 : 81) +
      (this.$q.screen.xs ? 12 : -12);
  },
  watch: {
    modelValue(newModelValue) {
      if (!!newModelValue) {
        this.tab = "create";
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
