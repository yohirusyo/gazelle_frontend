<template>
  <MenuItem :col="col" label="Пользователи" v-model="user">
    <template #main="{ height }">
      <UserList :col="col" v-if="!$q.screen.xs" :height="height" />
      <UserListMobile :col="col" v-else :height="height" />
    </template>
    <template #create="{ height, onDone }">
      <UserCreation :height="height" @done="onDone" />
    </template>
  </MenuItem>
</template>

<script>
import UserList from "./UserList.vue";
import UserListMobile from "./UserListMobile.vue";
import UserCreation from "./UserCreation.vue";
import { mapState } from "vuex";
import MenuItem from "src/components/base/MenuItem.vue";
export default {
  name: "User",
  components: {
    UserList,
    UserCreation,
    MenuItem,
    UserListMobile,
  },
  props: ["col"],
  computed: {
    ...mapState("current", ["user"]),
  },
};
</script>

<style></style>
