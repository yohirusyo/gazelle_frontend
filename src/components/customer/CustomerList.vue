<template>
  <div class="row items-center col col-shrink q-pr-md" ref="top">
    <div class="col-4">Подразделение</div>
    <div class="col-4">Ответственный</div>
    <div class="col-4">Телефон</div>
  </div>
  <q-separator class="q-ma-none" />
  <q-virtual-scroll :items="customers" separator v-slot="{ item }" :style="`height: ${height}px`" ref="scroll">
    <div :key="item.id" @click="setCustomer(item)">
      <div class="row items-center q-py-md">
        <div class="col-4">{{item.subdivision}}</div>
        <div class="col-4">{{item.fullname}}</div>
        <div class="col-4">{{item.phoneNumber}}</div>
      </div>
      <q-separator class="q-ma-none" />
    </div>
  </q-virtual-scroll>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "CustomerList",
  props: ['col'],
  computed: {
    ...mapState("customer", ["customers"]),
  },
  methods: {
    ...mapMutations("current", ["setCustomer"]),
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
