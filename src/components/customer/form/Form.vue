<template>
  <div class="col column">
    <q-form
      @submit="onSubmit"
      @reset="resetForm"
      class="col column justify-between q-pa-md"
      ref="form"
    >
      <div class="col row">
        <q-scroll-area class="col">
          <div class="column col q-gutter-y-md">
            <CustomerSelect
                            :phoneNumber="phoneNumber"
              :fullname="fullname"
              :subdivision="subdivision"
              :mvz="mvz"
              @update:phoneNumber="(val) => (phoneNumber = val)"
              @update:fullname="(val) => (fullname = val)"
              @update:subdivision="(val) => (subdivision = val)"
              @update:mvz="(val) => (mvz = val)"
            />
          </div>
        </q-scroll-area>
      </div>
      <div class="col col-shrink q-gutter-y-sm column">
        <div class="col row q-gutter-x-sm items-center">
          <q-btn
            v-if="_creationMode && !currentUser?.role.includes('OPERATOR')"
            text-color="white"
            label="Создать"
            unelevated
            class="border-none bg-blue-4 col"
            type="submit"
            no-caps
            dense
          />

          <q-btn
            v-if="!_creationMode && !currentUser?.role.includes('OPERATOR')"
            text-color="white"
            label="Изменить"
            unelevated
            class="border-none bg-blue-4 col"
            type="submit"
            no-caps
            dense
          />
          <q-btn
            v-if="!_creationMode"
            text-color="white"
            label="Сбросить пароль"
            unelevated
            class="border-none bg-blue-4 col"
            @click="resetPassword({ id: selected.id, isUser: false })"
            no-caps
            dense
          />
          <q-btn
            text-color="white"
            label="Отмена"
            unelevated
            class="border-none bg-green col"
            @click="onCancel()"
            no-caps
            dense
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CustomerSelect from "./fields/Customer.vue";
export default {
  name: "CustomerForm",
  components: {
    CustomerSelect,
  },
  props: ["selected"],
  data() {
    return {
      fullname: null,
      subdivision: null,
      phoneNumber: null,
      mvz: null,
      _creationMode: false,
    };
  },
  computed: {
    ...mapState("current", [
      "selectedTransportId",
      "orderIsEmergency",
      "removeOrderReason",
      "currentUser",
    ]),
  },
  methods: {
    ...mapActions("customer", ["addCustomer", "updateCustomer"]),
    ...mapActions("auth", ["resetPassword"]),
    async onAddCustomer() {
      await this.addCustomer({
        fullname: this.fullname,
        phoneNumber: this.phoneNumber,
        subdivision: this.subdivision,
        mvz: this.mvz,
      });
      this.$refs.form.reset();
    },
    async onUpdateDriver() {
      await this.updateCustomer({
        id: this.selected.id,
        fullname: this.fullname,
        phoneNumber: this.phoneNumber,
        subdivision: this.subdivision,
        mvz: this.mvz,
      });
      this.$refs.form.reset();
    },
    async onSubmit() {
      this._creationMode
        ? await this.onAddCustomer()
        : await this.onUpdateDriver();
    },
    resetForm() {
      this.fullname = null;
      this.subdivision = null;
      this.phoneNumber = null;
      this.mvz = null;

      this.$emit("done");
    },
    onCancel() {
      this.resetForm();
          },
    loadData() {
      if (this.selected) {
        this.fullname = this.selected.fullname;
        this.phoneNumber = this.selected.phoneNumber;
        this.subdivision = this.selected.subdivision;
        this.mvz = this.selected.mvz;

        this._creationMode = false;
      } else {
        this.fullname = null;
        this.subdivision = null;
        this.phoneNumber = null;
        this.mvz = null;

        this._creationMode = true;
      }
    },
  },
  mounted() {
    this.loadData();
  },
  watch: {
    selected: {
      handler(newVal, oldVal) {
        this._creationMode = !newVal;
        if (newVal != oldVal) this.loadData();
      },
    },
  },
};
</script>

<style></style>
