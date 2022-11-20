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
              label="Введите фамилию пользователя"
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
              label="Введите имя пользователя"
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
              label="Введите отчество пользователя"
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
              label="Введите регистрационный номер телефона пользователя"
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
              label="Введите рабочий номер телефона пользователя"
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
              label="Введите логин пользователя"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Обязательное поле!',
              ]"
              autocomplete="off"
            />
            <q-input
              v-model="_password"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Введите пароль пользователя"
              autocomplete="off"
              lazy-rules
              :rules="
                _creationMode
                  ? [
                      (val) =>
                        (val !== null && val !== '') || 'Обязательное поле!',
                    ]
                  : []
              "
            />
            <q-select
              v-model="_role"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Выберите роль"
              :options="roles"
              :option-label="(item) => item.description"
              :option-value="(item) => item.value"
              clearable
              autocomplete="off"
              lazy-rules
              :rules="[(val) => val !== null || 'Обязательное поле!']"
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
          @click="onRemoveUser"
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
  name: "UserCreation",
  computed: {
    ...mapState("current", ["user"]),
  },
  props: ["height"],
  methods: {
    ...mapActions("user", ["updateUser", "removeUser", "addUser"]),
    ...mapMutations("current", ["clearUser"]),
    async onAddUser() {
      await this.addUser({
        name: this._name,
        surname: this._surname,
        middlename: this._middlename,
        phoneNumber: this._phoneNumber,
        password: this._password,
        role: this._role.value,
        login: this._login,
      });
      this.$refs.form.reset();
    },
    async onUpdateUser() {
      const data = {
        id: this.user.id,
        name: this._name,
        surname: this._surname,
        middlename: this._middlename,
        phoneNumber: this._phoneNumber,
        workingPhoneNumber: this._workingPhoneNumber,
        password: this._password,
        role: this._role.value,
        login: this._login,
      };
      if (this._password == null ?? this._password == "") {
        delete data.password;
      }
      await this.updateUser(data);
      this.$refs.form.reset();
    },
    onCancel() {
      this.$refs.form.reset();
    },
    async onRemoveUser() {
      await this.removeUser({ id: this.user.id });
      this.$refs.form.reset();
    },
    async onSubmit() {
      this._creationMode ? await this.onAddUser() : await this.onUpdateUser();
    },
    resetForm() {
      this._name = null;
      this._surname = null;
      this._middlename = null;
      this._phoneNumber = null;
      this._workingPhoneNumber = null;
      this._login = null;
      this._role = null;
      this._password = null;
      this.$emit("done");
      this.clearUser();
    },
    loadData() {
      if (this.user) {
        this._name = this.user.name;
        this._surname = this.user.surname;
        this._middlename = this.user.middlename;
        this._phoneNumber = this.user.phoneNumber;
        this._workingPhoneNumber = this.user.workingPhoneNumber;
        this._login = this.user.login;
        this._role = this.roles.find((role) => role.value == this.user.role);
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
      _role: null,
      _password: null,
      roles: [
        {
          description: "Администратор",
          value: "ADMIN",
        },
        {
          description: "Диспетчер",
          value: "OPERATOR",
        },
        {
          description: "Наблюдатель",
          value: "WATCHER",
        },
      ],
    };
  },
  mounted() {
    this.loadData();
  },
  watch: {
    "user.name"() {
      if (this.user) {
        this.loadData();
      }
    },
    user() {
      this._creationMode = !this.user;
    },
  },
};
</script>

<style></style>
