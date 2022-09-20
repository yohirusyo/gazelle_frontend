<template>
  <div class="row">
    <div v-if="_parsedNumber == null" class="text-center">
      Некорректно введенный номер!
    </div>
    <div class="main-number row no-wrap" v-else>
      <div class="dot right">.</div>
      <div class="dot left">.</div>
      <div class="half-number col col-shrink row half-number-left no-wrap">
        <div class="number-letter">{{ _parsedNumber?.[0] }}</div>
        <div>{{ _parsedNumber?.[1] }}</div>
        <div class="number-letter">{{ _parsedNumber?.[2] }}</div>
      </div>
      <div
        class="half-number col col-shrink column items-end justify-center"
      >
        <div class="reg q-pr-xs">{{ _parsedNumber?.[3] }}</div>
        <div class="row items-center no-wrap">
          <div class="rus">RUS</div>
          <img class="flag" src="flag-of-russia.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AutoNumber",
  props: ["number"],
  computed: {
    _parsedNumber: {
      get() {
        return this.parseNumber(this.number);
      },
    },
  },
  methods: {
    parseNumber(number) {
      if (
        !/[ETYOPAHKXCBM]{1}\s{0,1}\d{3}\s{0,1}[ETYOPAHKXCBM]{2}\s{0,1}\d{2,3}/.test(
          number
        )
      )
        return;
      number = number.replace(/\s+/g, "");
      return [
        number.substring(0, 1),
        number.substring(1, 4),
        number.substring(4, 6),
        number.substring(6),
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.main-number {
  background-color: black;
  border-radius: 6px;
  padding: 2px;
  font-size: 1.6rem;
  font-family: RoadNumbers2;
  gap: 2px;
  line-height: 12px;
  position: relative;
}

.half-number {
  background-color: white;
  border-radius: 4px;
  padding-top: 4px;
  padding-left: 4px;
  padding-right: 6px;
}

.half-number-left {
  padding-left: 8px;
  padding-right: 6px;
  letter-spacing: 2px;
}

.rus {
  color: black !important;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.6rem;
}

.reg {
  font-size: 1.4rem;
  transform: translateY(-45%);
}

.flag {
  width: 10px;
  object-fit: contain;
  margin-left: 2px;
//   border: 1px solid black;
}

.dot {
  position: absolute;
  top: 0;
}

.right {
  right: 3px;
}

.left {
  left: 3px;
}
</style>
