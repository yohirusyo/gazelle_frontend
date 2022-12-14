<template>
    <q-page class="column">
        <YaMap />
    </q-page>
</template>
  
<script>
import YaMap from "src/components/map/YaMap.vue";

export default {
    name: "MapPage",
    components: {
        YaMap,
    },
};
</script>
  
<style lang="scss" scoped>

</style>
  