<template>
  <VScrolltable :rows="drivers" :columns="columns" row-key="time">
    <template v-slot:body="props">
      <q-tr :props="props" @click="setDriver(props.row)" class="text-center">
        <q-td key="fullname" :props="props" class="pre">
          {{ `${props.row.surname} ${props.row.name} ${props.row.middlename}` }}
        </q-td>
        <q-td key="phoneNumber" :props="props">
          {{ props.row.workingPhoneNumber }}
        </q-td>
        <q-td
          key="isOnDriverShift"
          :props="props"
          :class="
            props.row.isOnDriverShift && version != props.row.version
              ? 'text-red'
              : ''
          "
        >
          {{
            props.row.isOnDriverShift
              ? `Да (Версия: ${props.row.version ?? "1.1.0 или ниже"})`
              : "Нет"
          }}
        </q-td>
      </q-tr>
    </template>
  </VScrolltable>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import VScrolltable from "src/components/base/VScrolltable.vue";
export default {
  name: "DriverList",
  props: ["col", "height"],
  computed: {
    ...mapState("user", ["drivers"]),
  },
  components: {
    VScrolltable,
  },
  methods: {
    ...mapMutations("current", ["setDriver"]),
    async fetchVersion() {
      try {
        const response = await fetch(
          "http://taxi.mmk.ru/updates/new/version.info",
          {
            method: "GET",
          }
        );
        const data = await response.text();
        const version = data.split(";")[0];
        this.version = version;
      } catch (error) {
        this.version = null;
      }
    },
  },
  async mounted() {
    await this.fetchVersion();
  },
  data() {
    return {
      version: null,
      columns: [
        {
          name: "fullname",
          required: true,
          label: "ФИО",
          align: "center",
          sortable: false,
        },
        {
          name: "phoneNumber",
          required: true,
          label: "Номер телефона",
          align: "center",
          sortable: false,
        },
        {
          name: "isOnDriverShift",
          required: false,
          label: "На смене",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
};
</script>

<style></style>
