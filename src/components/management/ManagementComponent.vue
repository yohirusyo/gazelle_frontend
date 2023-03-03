<template>
  <MenuItem
    :col="col"
    label="Управления"
    v-model="management"
  >
  <template #main="{}">
    <ManagementList />
  </template>
  <template #create="{ onDone }">
    <ManagementCreation @done="onDone" />
  </template>

  </MenuItem>
</template>

<script>
import MenuItem from "src/components/base/MenuItem.vue";
import ManagementList from "./ManagementList.vue";
import ManagementCreation from "./ManagementCreation.vue";
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    MenuItem,
    ManagementList,
    ManagementCreation
  },
  props: ["col"],
  computed: {
    ...mapState("current", ["management"]),
  },
  methods: {
    ...mapActions('management', ['requestManagements'])
  },
  mounted() {
    this.requestManagements();
  }
};
</script>

<style>

</style>
