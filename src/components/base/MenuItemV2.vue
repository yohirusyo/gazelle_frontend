<template>
  <div class="col row full-height">
    <div
      class="col col-shrink"
      :class="$q.screen.xs ? 'q-mr-sm' : 'q-mr-md'"
      v-if="!$q.screen.xs"
    >
      <q-tabs
        v-model="tab"
        dense
        class="text-grey full-height"
        :class="$q.screen.xs ? 'q-pt-sm q-pl-sm' : ''"
        active-color="primary"
        indicator-color="transparent"
        narrow-indicator
        vertical
        ref="tabs"
      >
        <q-tab
          name="main"
          icon="list"
          no-caps
          :ripple="false"
          style="border-radius: 8px"
          v-if="!onlyCreate"
        >
          <q-tooltip>
            {{ label }}
          </q-tooltip>
        </q-tab>
        <q-tab
          name="create"
          icon="edit"
          no-caps
          :ripple="false"
          style="border-radius: 8px"
          v-if="!currentUser?.role.includes('WATCHER')"
        >
          <q-tooltip>
            {{ modelValue ? "Редактирование" : "Создание" }}
          </q-tooltip>
        </q-tab>
        <slot name="menu" v-if="!currentUser?.role.includes('WATCHER') || currentUser?.role.includes('WATCHER_WITH_REPORTS')" />
      </q-tabs>
    </div>

    <q-tab-panels
      v-model="tab"
      animated
      class="col column"
      :class="$q.screen.xs ? '' : 'menu-scroll-area '"
      keep-alive
      :style="` ${
        !$q.screen.xs
          ? 'border: 1px solid rgba(0, 0, 0, 0.12);'
          : '  background: rgba(173, 216, 230, 0.1)'
      }`"
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel name="main" class="col column menu-scroll-area_inner">
        <slot name="main" :height="height" :onSelected="setSelected" />
      </q-tab-panel>

      <q-tab-panel name="create" class="col column">
        <slot
          name="create"
          :height="height"
          :onDone="onDone"
          :selected="selectedValue"
        />
      </q-tab-panel>
    </q-tab-panels>
    <div
      v-if="$q.screen.xs"
      class="col col-shrink"
      :class="$q.screen.xs ? 'q-mr-sm' : 'q-mr-md'"
      style="border-left: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <q-tabs
        v-model="tab"
        dense
        class="text-grey full-height"
        :class="$q.screen.xs ? 'q-pt-sm q-pl-sm' : ''"
        active-color="primary"
        indicator-color="transparent"
        narrow-indicator
        vertical
        ref="tabs"
      >
        <q-tab
          name="main"
          icon="list"
          no-caps
          :ripple="false"
          style="border-radius: 8px"
          v-if="!onlyCreate"
        >
          <q-tooltip>
            {{ label }}
          </q-tooltip>
        </q-tab>
        <q-tab
          name="create"
          icon="edit"
          no-caps
          :ripple="false"
          style="border-radius: 8px"
          v-if="!currentUser?.role.includes('WATCHER')"
        >
          <q-tooltip>
            {{ modelValue ? "Редактирование" : "Создание" }}
          </q-tooltip>
        </q-tab>
        <slot name="menu" v-if="!currentUser?.role.includes('WATCHER')" />
      </q-tabs>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MenuItem",
  props: ["col", "label", "modelValue", "withoutRole", "onlyCreate"],
  computed: {
    ...mapState("current", ["currentUser"]),
  },
  data() {
    return {
      tab: "main",
      height: 0,
      selectedValue: null,
    };
  },
  methods: {
    async onDone() {
      if (!this.onlyCreate) {
        this.tab = "main";
      }
      this.selectedValue = null;
    },
    setSelected(val) {
      this.selectedValue = val;
    },
  },
  async mounted() {
    // this.height = this.$refs.tabs.$el.clientHeight - 2;
    if (this.onlyCreate) {
      this.tab = "create";
    }
  },
  watch: {
    modelValue(newModelValue) {
      if (!!newModelValue) {
        this.tab = "create";
        this.setSelected(newModelValue);
      }
    },
    selectedValue(newSelValue) {
      if (!!newSelValue) {
        this.tab = "create";
      }
    },
  },
};
</script>

<style lang="scss">
.menu-scroll-area {
  // border-radius: 8px;
  box-sizing: border-box;

  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.menu-scroll-area_inner {
  box-sizing: border-box;
}
</style>
