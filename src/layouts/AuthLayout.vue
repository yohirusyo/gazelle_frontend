<template>
  <q-layout>
    <q-page class="flex bg-image flex-center bg-grey-2">
      <BaseCard
        v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        class="bg-white q-px-lg q-pb-lg"
      >
        <div class="row items-end justify-center q-py-xl">
          <div class="text-h6 col-shrink">Добрый день!</div>
        </div>

        <q-form class="q-gutter-md" @reset="onReset" @submit="onSubmit">
          <q-select
            v-model="_login"
            type="text"
            label="Логин"
            borderless
            dense
            class="bg-grey-2 border-sm q-px-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            autocomplete="off"
            lazy-rules
            name="login"
            :options="operators"
            :option-label="(item) => `${item.surname} ${item.name} ${item.middlename}`"
          />
          <q-input
            v-model="_password"
            :type="isPwd ? 'password' : 'text'"
            label="Пароль"
            borderless
            dense
            class="bg-grey-2 border-sm q-px-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            autocomplete="off"
            lazy-rules
            name="password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer q-pr-md"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div class="row">
            <q-btn
              color="primary"
              text-color="white"
              label="Вход"
              unelevated
              class="border-sm shadow-white col"
              aria-label="Login"
              type="submit"
            />
          </div>
        </q-form>
      </BaseCard>
    </q-page>
  </q-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import BaseCard from "components/base/Card.vue";
export default {
  name: "Authorization",
  data() {
    return {
      isPwd: true,
    };
  },
  components: {
    BaseCard,
  },
  async mounted() {
    await this.requestOperators();
  },
  methods: {
    ...mapActions("auth", ["Signin"]),
    ...mapMutations("auth", ["setState"]),
    ...mapActions("user", ["requestOperators"]),
    async onSubmit() {
      await this.Signin({
        login: this._login.login,
        password: this._password,
      }).then(() => {
        this.$router.push({ path: "/" });
      });
    },
    onReset() {
      this.login = null;
      this.password = null;
    },
  },
  computed: {
    ...mapState("auth", ["password", "login"]),
    ...mapState("user", ["operators"]),
    _login: {
      get() {
        return this.login;
      },
      set(val) {
        this.setState({ prop: "login", val: val });
      },
    },
    _password: {
      get() {
        return this.password;
      },
      set(val) {
        this.setState({ prop: "password", val: val });
      },
    },
  },
};
</script>

<style scoped></style>
