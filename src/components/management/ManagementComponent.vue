<template>
  <MenuItem
    :col="col"
    label="Управления"
    v-model="management"
  >
  <template #main="{}">
    <ManagementList @reqManagements="reqManagements"/>
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
import dayjs from "dayjs";
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
    ...mapActions('management', ['requestManagements', 'requestChangeManagements']),
    reqManagements(val) {
      this.requestChangeManagements({year: val.year, month: val.month});
    }
  },
  mounted() {
    this.requestManagements({year: dayjs().year(), month: dayjs().month()});
  }
};
</script>

<style>

</style>
