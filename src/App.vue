<template>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";
import { mapActions } from "vuex";
export default defineComponent({
  name: "App",
  methods: {
    ...mapActions("current", ["requestCurrentUser"]),
  },
  async mounted() {
    if (
      localStorage.getItem("token") != null &&
      localStorage.getItem("token") != ""
    ) {
      await this.requestCurrentUser();
    } else {
    }
  },
});
</script>
