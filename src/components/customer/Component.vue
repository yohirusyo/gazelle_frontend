<template>
  <!-- <div class="col column">
    <div class="row justify-between items-center">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="main" label="Ответственные" no-caps />
        <q-tab name="create" label="Создание" no-caps />
        <q-tab
          name="edit"
          label="Редактирование"
          :disable="customer == null"
          no-caps
        />
      </q-tabs>
    </div>
    <q-separator spaced />
    <q-tab-panels v-model="tab" animated class="col" keep-alive>
      <q-tab-panel name="main" class="col column">
        <CustomerList :col="col" />
      </q-tab-panel>

      <q-tab-panel name="create" class="col column">
        <CustomerCreation @done="onDone" />
      </q-tab-panel>

      <q-tab-panel name="edit" class="col column">
        <CustomerEdit @done="onDone" />
      </q-tab-panel>
    </q-tab-panels>
  </div> -->

  <MenuItemV2 label="Транспорт" v-model="customer">
    <template #main="{ height, onSelected }">
      <CustomerList
        v-if="!$q.screen.xs"
        :height="height"
        @onSelected="onSelected"
      />
    </template>
    <template #create="{ height, onDone, selected }">
      <CustomerForm :height="height" @done="onDone" :selected="selected" />
    </template>
  </MenuItemV2>
</template>

<script>
import MenuItemV2 from "src/components/base/MenuItemV2.vue";
import CustomerForm from "./form/Form.vue";
import CustomerList from "./list/List.vue";
// import CustomerCreation from "./CustomerCreation.vue";
// import CustomerEdit from "./CustomerEdit.vue";
export default {
  name: "Customer",
  components: {
    MenuItemV2,
    CustomerList,
    CustomerForm,
  },
  data() {
    return {
      customer: null,
    };
  },
};
</script>

<style></style>
