<template>
  <q-form
    @submit="onAddDriver"
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
            autocomplete="off"
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
            autocomplete="off"
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
            autocomplete="off"
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
            autocomplete="off"
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
            autocomplete="off"
          />
        </div>
      </q-scroll-area>
    </div>

    <q-btn
      text-color="white"
      label="Создать"
      unelevated
      class="border-sm shadow-white col col-shrink"
      color="primary"
      type="submit"
    />
  </q-form>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "DriverCreation",
  methods: {
    ...mapActions("user", ["addDriver"]),
    async onAddDriver() {
      await this.addDriver({
        name: this._name,
        surname: this._surname,
        middlename: this._middlename,
        phoneNumber: this._phoneNumber,
        login: this._login,
      });
      this.$emit("done");
      this.$refs.form.reset();
    },
    resetForm() {
      this._name = null;
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
};
</script>

<style></style>
