<template>
  <q-form
    @submit="onUpdateDriver"
    @reset="resetForm"
    class="col column justify-between"
    ref="form"
  >
    <div class="col row q-mb-md">
      <q-scroll-area class="col">
        <div class="column q-gutter-y-md">
          <q-input
            v-model="_surname"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Введите фамилию водителя"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Обязательное поле!',
            ]"
          />
          <q-input
            v-model="_name"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Введите имя водителя"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Обязательное поле!',
            ]"
          />
          <q-input
            v-model="_middlename"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Введите отчество водителя"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Обязательное поле!',
            ]"
          />
          <q-input
            v-model="_phoneNumber"
            mask="+7 (###) ### ## ##"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Введите регистрационный номер телефона водителя"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Обязательное поле!',
            ]"
          />
          <q-input
            v-model="_login"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Введите логин водителя"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Обязательное поле!',
            ]"
          />
        </div>
      </q-scroll-area>
    </div>
    <div class="row">
      <q-btn
        text-color="white"
        label="Изменить"
        unelevated
        class="border-sm shadow-white col q-mr-md"
        color="primary"
        type="submit"
      />
      <q-btn
        text-color="white"
        label="Удалить"
        unelevated
        class="border-sm shadow-white col col-shrink"
        color="red"
        @click="onRemoveDriver"
      />
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "DriverEdit",
  computed: {
    ...mapState("current", ["coords", "driver"]),
  },
  methods: {
    ...mapActions("user", ["updateDriver", "removeDriver"]),
    ...mapMutations("current", ["clearCoords", "clearDriver"]),
    async onUpdateDriver() {
      this.$emit("done");
      await this.updateDriver({
        id: this.driver.id,
        name: this._name,
        surname: this._surname,
        middlename: this._middlename,
        phoneNumber: this._phoneNumber,
        login: this._login,
      });
      this.$refs.form.reset();
    },
    async onRemoveDriver() {
      this.$emit("done");
      await this.removeDriver({ id: this.driver.id });
      this.$refs.form.reset();
    },
    resetForm() {
      this._name = null;
      this.clearDriver();
    },
  },
  data() {
    return {
      _name: null,
      _surname: null,
      _middlename: null,
      _phoneNumber: null,
      _login: null,
    };
  },
  mounted() {
    this._name = this.driver.name;
    this._surname = this.driver.surname;
    this._middlename = this.driver.middlename;
    this._phoneNumber = this.driver.phoneNumber;
    this._login = this.driver.login;
  },
  watch: {
    "driver.name"() {
      if (this.driver) {
        this._name = this.driver.name;
        this._surname = this.driver.surname;
        this._middlename = this.driver.middlename;
        this._phoneNumber = this.driver.phoneNumber;
        this._login = this.driver.login;
      }
    },
  },
};
</script>

<style></style>
