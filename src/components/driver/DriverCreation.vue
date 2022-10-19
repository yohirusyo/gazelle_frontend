<template>
  <div class="col column">
    <q-form
      @submit="onSubmit"
      @reset="resetForm"
      class="col column justify-between q-pa-md"
      ref="form"
    >
      <div class="col row q-mb-md">
        <q-scroll-area class="col">
          <div class="column q-gutter-y-md">
            <q-input
              v-model="_surname"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Введите фамилию водителя"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Обязательное поле!',
              ]"
              autocomplete="off"
            />
            <q-input
              v-model="_name"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Введите имя водителя"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Обязательное поле!',
              ]"
              autocomplete="off"
            />
            <q-input
              v-model="_middlename"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Введите отчество водителя"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Обязательное поле!',
              ]"
              autocomplete="off"
            />
            <q-input
              v-model="_phoneNumber"
              mask="+7 (###) ### ## ##"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Введите регистрационный номер телефона водителя"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Обязательное поле!',
              ]"
              autocomplete="off"
            />
            <q-input
              v-model="_workingPhoneNumber"
              mask="+7 (###) ### ## ##"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Введите рабочий номер телефона водителя"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Обязательное поле!',
              ]"
              v-if="!_creationMode"
              autocomplete="off"
            />
            <q-input
              v-model="_login"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Введите логин водителя"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Обязательное поле!',
              ]"
              autocomplete="off"
            />
          </div>
        </q-scroll-area>
      </div>
      <div class="row">
        <q-btn
          v-if="_creationMode"
          text-color="white"
          label="Создать"
          unelevated
          class="border-sm shadow-white col"
          color="primary"
          type="submit"
        />
        <q-btn
          v-if="!_creationMode"
          text-color="white"
          label="Изменить"
          unelevated
          class="border-sm shadow-white col q-mr-md"
          color="primary"
          type="submit"
        />
        <q-btn
          v-if="!_creationMode"
          text-color="white"
          label="Удалить"
          unelevated
          class="border-sm shadow-white col col-shrink"
          color="red"
          @click="onRemoveDriver"
        />
        <q-btn
          text-color="white"
          label="Отмена"
          unelevated
          class="border-sm shadow-white col col-shrink q-ml-md"
          color="green"
          @click="onCancel()"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "DriverCreation",
  computed: {
    ...mapState("current", ["coords", "driver"]),
  },
  props: ['height'],
  methods: {
    ...mapActions("user", ["updateDriver", "removeDriver", "addDriver"]),
    ...mapMutations("current", ["clearCoords", "clearDriver"]),
    async onAddDriver() {
      await this.addDriver({
        name: this._name,
        surname: this._surname,
        middlename: this._middlename,
        phoneNumber: this._phoneNumber,
        login: this._login,
      });
      this.$refs.form.reset();
    },
    async onUpdateDriver() {
      await this.updateDriver({
        id: this.driver.id,
        name: this._name,
        surname: this._surname,
        middlename: this._middlename,
        phoneNumber: this._phoneNumber,
        workingPhoneNumber: this._workingPhoneNumber,
        login: this._login,
      });
      this.$refs.form.reset();
    },
    onCancel() {
      this.$refs.form.reset();
    },
    async onRemoveDriver() {
      await this.removeDriver({ id: this.driver.id });
      this.$refs.form.reset();
    },
    async onSubmit() {
      this._creationMode
        ? await this.onAddDriver()
        : await this.onUpdateDriver();
    },
    resetForm() {
      this._name = null;
      this._surname = null;
      this._middlename = null;
      this._phoneNumber = null;
      this._workingPhoneNumber = null;
      this._login = null;
      this.$emit("done");
      this.clearDriver();
    },
    loadData() {
      if (this.driver) {
        this._name = this.driver.name;
        this._surname = this.driver.surname;
        this._middlename = this.driver.middlename;
        this._phoneNumber = this.driver.phoneNumber;
        this._workingPhoneNumber = this.driver.workingPhoneNumber;
        this._login = this.driver.login;
        this._creationMode = false;
      } else {
        this._creationMode = true;
      }
    },
  },
  data() {
    return {
      _name: null,
      _surname: null,
      _middlename: null,
      _phoneNumber: null,
      _workingPhoneNumber: null,
      _login: null,
      _creationMode: true,
    };
  },
  mounted() {
    this.loadData();
  },
  watch: {
    "driver.name"() {
      if (this.driver) {
        this.loadData();
      }
    },
    driver() {
      this._creationMode = !this.driver;
    },
  },
};
</script>

<style></style>
