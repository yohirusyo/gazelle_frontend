<template>
  <router-view />
</template>
<script>

import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import { Loading } from "quasar";
export default defineComponent({
  name: "App",
  computed: {
    ...mapGetters("loading", ["isLoading"]),
  },
  methods: {
    ...mapActions("current", ["requestCurrentUser"]),
    loadingOn() {
      if (!this._isLoading) {
        Loading.show();
        this._isLoading = true;
      }
    },
    loadingOff() {
      if (this._isLoading) {
        Loading.hide();
        this.isLoading = false;
      }
    },
  },
  async mounted() {
    if (
      localStorage.getItem("token") != null &&
      localStorage.getItem("token") != ""
    ) {
      await this.requestCurrentUser();
    }
  },
  data() {
    return {
      _isLoading: false,
    };
  },
  watch: {
    isLoading(val) {
      if (val) {
        this.loadingOn();
      } else {
        this.loadingOff();
      }
    },
  },
});
</script>
