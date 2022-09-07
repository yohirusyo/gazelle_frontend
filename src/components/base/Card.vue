<template>
  <div class="bg-white shadow-white" :class="'border-' + radius">
    <slot />
  </div>
</template>

<script>
export default {
  name: "BasicCard",
  props: {
    radius: {
      type: String,
      default: () => "md",
    },
  },
  setup(props) {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
