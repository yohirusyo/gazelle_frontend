<template>
  <router-view v-if="enabled" />
  <div class="text-center text-h4" v-else>
    Система будет открыта через: {{ diff }}
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import { Loading } from "quasar";
import * as moment from "moment";
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
    if (this.startDate < moment()) {
      this.enabled = true;
    } else {
      this.interval = setInterval(() => {
        const diff = this.startDate.diff(moment());
        if (diff > 0) {
          this.enabled = false;

          this.diff = moment
            .utc(moment(this.startDate).subtract(1, "d").diff(moment()))
            .format("HH:mm:ss");
        } else {
          this.enabled = true;
        }
      }, 1000);
    }

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
      interval: null,
      startDate: moment("2023-03-23 18:00:00", "YYYY-MM-DD HH:mm:ss"),
      diff: null,
      enabled: false,
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
