<template>
  <div class="column col">
    <div class="col column">
      <div class="col col-shrink text-h6">Использование такси персоналом</div>
      <q-separator />
      <div
        class="col q-pt-md"
        :class="!myHierarchy?.isSubdivision ? 'q-pb-md' : ''"
      >
        <VScrolltable :rows="myWorkers" :columns="columns" row-key="id">
          <template v-slot:body="props">
            <Item :props="props" />
          </template>
        </VScrolltable>
      </div>
      <AddToHierarchy
        class="col col-shrink"
        v-if="!myHierarchy?.isSubdivision"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddToHierarchy from "./AddToHierarchy.vue";
import VScrolltable from "src/components/base/VScrolltable.vue";
import Item from "./Item.vue";
export default {
  components: {
    AddToHierarchy,
    VScrolltable,
    Item,
  },
  data() {
    return {
      columns: [
        {
          name: "ownerId",
          required: true,
          label: "Ответственный",
          align: "center",
          sortable: false,
        },
        {
          name: "percentage",
          required: true,
          label: "Процент от общего за сегодня",
          align: "center",
          sortable: false,
        },
        {
          name: "departurePoint",
          required: true,
          label: "Использовано сегодня",
          align: "center",
          sortable: false,
        },

      ],
    };
  },
  computed: {
    ...mapGetters("hierarchy", ["myWorkers", "myHierarchy"]),
  },
};
</script>
