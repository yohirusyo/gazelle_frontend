<template>
  <q-page class="row bg-white">
    <div
      class="col"
      :class="{ 'q-pa-md': !$q.screen.xs }"
      style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
    >
      <Recommendation :col="12" />
    </div>
    <div class="col column" v-if="!$q.screen.xs">
      <div class="col row" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)">
        <div class="col q-pa-md">
          <!-- <Transport :col="6" :isLocal="false" /> -->
        </div>
      </div>
    </div>
  </q-page>

  <!-- <q-page>
    <div class="column fit">
      <div class="col">
        <VScrolltable
          :rows="cargoTypes"
          :columns="[]"
          row-key="id"
          id="report-table"
        />
      </div>
    </div>
  </q-page> -->
</template>

<script setup>
import Recommendation from "src/components/recommendation/Component.vue";
</script>
