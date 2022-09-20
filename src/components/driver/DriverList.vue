<template>
  <div class="row items-center col col-shrink q-pr-md" ref="top">
    <div class="col-7">ФИО</div>
    <div class="col-3">Номер телефона</div>
    <div class="col-2 text-center">На смене</div>
  </div>
  <q-separator class="q-ma-none" />
  <q-virtual-scroll :items="drivers" separator v-slot="{ item }" :style="`height: ${height}px`" ref="scroll">
    <div :key="item.id" @click="setDriver(item)">
      <div class="row items-center q-py-md">
        <div class="col-7">{{ `${item.surname} ${item.name} ${item.middlename}` }}</div>
        <div class="col-3">{{ item.workingPhoneNumber }}</div>
        <div class="col-2 text-center">{{ item.isOnDriverShift ? 'Да' : "Нет" }}</div>
      </div>
      <q-separator class="q-ma-none" />
    </div>
  </q-virtual-scroll>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "DriverList",
  props: ['col'],
  computed: {
    ...mapState("user", ["drivers"]),
  },
  methods: {
    ...mapMutations("current", ["setDriver"]),
  },
  async mounted() {
    this.height =
      (document.getElementsByClassName("q-page")[0]?.clientHeight / 12 * this.col) - this.$refs.top.clientHeight - 98;
  },
  data() {
    return {
      height: 0,
    }
  }
};
</script>

<style>

</style>
