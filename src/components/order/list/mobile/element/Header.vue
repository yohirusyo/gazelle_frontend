<template>
  <div class="row justify-evenly">
    <q-chip> Маршрут {{ routeId }} </q-chip>
  </div>
</template>

<script>
export default {
  props: ["routeId"],
};
</script>
