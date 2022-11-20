<template>
  <q-layout>
    <q-page class="flex bg-image flex-center bg-grey-2">
      <BaseCard
        v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        class="bg-white q-px-lg q-pb-lg"
        v-if="!loading"
      >
        <div class="row items-end justify-center q-py-xl">
          <div class="text-h6 col-shrink">Добрый день{{ isCustomer ? ", заказчик!" : (isOperator ? ", диспетчер!" : "!") }}</div>
        </div>

        <q-form
          class="q-gutter-md"
          @reset="onReset"
          @submit="onSubmit"
          ref="form"
        >
          <q-select
            v-model="selectedOperator"
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
            :option-label="
              (item) => `${item.login}`
            "
            v-if="isOperator"
          />
          <q-input
            v-model="login"
            type="text"
            borderless
            dense
            class="bg-grey-2 border-sm q-px-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            autocomplete="off"
            lazy-rules
            label="Телефон"
            mask="+7 (###) ### ## ##"
            :rules="[
              (val) => (val !== null && val !== '') || 'Обязательное поле!',
            ]"
            v-if="isCustomer"
          />
          <q-input
            v-model="password"
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
            v-if="isCustomer || isOperator"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer q-pr-md"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="row" v-if="isCustomer || isOperator">
            <q-btn
              color="primary"
              text-color="white"
              label="Вход"
              unelevated
              class="border-sm shadow-white col"
              aria-label="Login"
              type="submit"
              no-caps
            />
          </div>
          <div class="row" v-if="!isCustomer && !isOperator">
            <q-btn
              color="primary"
              text-color="white"
              label="Я диспетчер"
              unelevated
              class="border-sm shadow-white col"
              aria-label="Login"
              no-caps
              @click="
                () => {
                  isCustomer = false;
                  isOperator = true;
                }
              "
            />
          </div>
          <div class="row" v-if="!isCustomer && !isOperator">
            <q-btn
              color="primary"
              text-color="white"
              label="Я заказчик"
              unelevated
              class="border-sm shadow-white col"
              aria-label="Login"
              @click="
                () => {
                  isCustomer = true;
                  isOperator = false;
                }
              "
              no-caps
            />
          </div>
          <div class="row justify-center" v-if="isCustomer || isOperator">
            <span
              class="text-blue underline"
              @click="
                () => {
                  login = null;
                  selectedOperator = null;
                  if (isCustomer) {
                    isCustomer = false;
                    isOperator = true;
                  } else if (isOperator) {
                    isCustomer = true;
                    isOperator = false;
                  }
                }
              "
            >
              Я {{ !isCustomer ? "заказчик" : "диспетчер" }}
            </span>
          </div>
        </q-form>
      </BaseCard>
    </q-page>
  </q-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import BaseCard from "components/base/Card.vue";
import { Loading } from "quasar";
export default {
  name: "Authorization",
  data() {
    return {
      isPwd: true,
      isCustomer: false,
      isOperator: false,
      loading: true,
      login: null,
      password: null,
      selectedOperator: null,
    };
  },
  components: {
    BaseCard,
  },
  async mounted() {
    Loading.show({ message: "Проверка авторизации" });
    if (
      localStorage.getItem("token") != null &&
      localStorage.getItem("token") != ""
    ) {
      await this.requestCurrentUser();
      return this.$router.push({ path: "/" });
    }
    await this.requestOperators();
    Loading.hide();
    this.loading = false;
  },
  methods: {
    ...mapActions("auth", ["Signin"]),
    ...mapMutations("auth", ["setState"]),
    ...mapActions("user", ["requestOperators"]),
    ...mapActions("current", ["requestCurrentUser"]),
    async onSubmit() {
      if (this.isOperator || this.isCustomer) {
        await this.Signin({
          login: this.isOperator ? this.selectedOperator.login : this.login,
          password: this.password,
        });
        await this.requestCurrentUser();
        this.$refs.form.reset();
        this.$router.push({ path: "/" });
      }
    },
    onReset() {
      this.isCustomer = false;
      this.isOperator = false;
      this.login = null;
      this.selectedOperator = null;
      this.password = null;
    },
  },
  computed: {
    ...mapState("user", ["operators"]),
  },
};
</script>

<style scoped>
.underline {
  text-decoration: underline;
  cursor: pointer;
  user-select: none;
}
</style>
