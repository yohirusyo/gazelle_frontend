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
          <q-select
            class="bg-grey-2 q-px-md border-sm shadow-white-inset"
            fill-input
            hide-selected
            use-input
            input-debounce="0"
            :options="getFilteredCustomers(_filterCustomers)"
            @filter="filterFnCustomers"
            @input-value="_setCustomerFullname"
            :model-value="customerFullname"
            borderless
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Ответственный"
            autocomplete="off"
            map-options
            ref="customer"
          >
            <template v-slot:option="{ opt, itemProps, itemEvents }">
              <q-item
                v-bind="itemProps"
                v-on="itemEvents"
                @click="onCustomerSelect(opt)"
              >
                <q-item-section>
                  <q-item-label>{{ `${opt.fullname} ( ${opt.subdivision} ) ${opt.phoneNumber}` }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            :model-value="_customerSubdivision"
            type="text"
            borderless
            fill-input
            hide-selected
            use-input
            input-debounce="0"
            :options="getFilteredSubdivisions(_filterSubdivision)"
            @filter="filterFnSubdivisions"
            @input-value="_setCustomerSubdivision"
            class="bg-grey-2 border-sm shadow-white-inset q-px-md"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Подразделение"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Обязательное поле!',
            ]"
            autocomplete="off"
          />

          <q-input
            v-model="_customerPhoneNumber"
            type="text"
            borderless
            class="bg-grey-2 border-sm shadow-white-inset q-px-md"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Телефон"
            mask="+7 (###) ### ## ##"
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
        text-color="white"
        label="Изменить"
        unelevated
        class="border-sm shadow-white col q-mr-md"
        color="primary"
        type="submit"
      />
      <q-btn
        text-color="white"
        label="Сбросить пароль"
        unelevated
        class="border-sm shadow-white col"
        color="primary"
        @click="resetPassword({ id: customer.id, isUser: false })"
        no-caps
      />
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";

export default {
  name: "CustomerEdit",
  computed: {
    ...mapState("customer", [
      "customerPhoneNumber",
      "customerFullname",
      "customerSubdivision",
    ]),
    ...mapState("current", [
      "customer",
    ]),
    ...mapGetters("customer", ["getFilteredCustomers", "getFilteredSubdivisions"]),
    _customerPhoneNumber: {
      get() {
        return this.customerPhoneNumber;
      },
      set(newVal) {
        this.setCustomerPhoneNumber(newVal);
      },
    },
    _customerSubdivision: {
      get() {
        return this.customerSubdivision;
      },
      set(newVal) {
        this.setCustomerSubdivision(newVal);
      },
    },
  },
  methods: {
    ...mapMutations("customer", [
      "setCustomerPhoneNumber",
      "setCustomerFullname",
      "setCustomerSubdivision",
    ]),
    ...mapActions("customer", ["updateCustomer"]),
    ...mapActions('auth',['resetPassword']),
    _setCustomerFullname(val) {
      if (val.fullname) return this.setCustomerFullname(val.fullname);
      this.setCustomerFullname(val);
    },
    _setCustomerSubdivision(val) {
      this._customerSubdivision = val;
    },
    onCustomerSelect(val) {
      this.setCustomerFullname(val.fullname);
      this._customerPhoneNumber = val.phoneNumber;
      this._customerSubdivision = val.subdivision;
    },
    filterFnCustomers(val, update) {
      update(() => {
        if (val.fullname) {
          this.setCustomerFullname(val.fullname);
          this._filterCustomers = val.fullname;
          return;
        }
        this._filterCustomers = val;
      });
    },
    filterFnSubdivisions(val, update) {
      update(() => {
        this._filterSubdivision = val;
      });
    },
    async onUpdateDriver() {
      await this.updateCustomer({
        id: this.customer.id,
        fullname: this.customerFullname,
        phoneNumber: this.customerPhoneNumber,
        subdivision: this.customerSubdivision,
      });
      this.$emit("done");
      this.$refs.form.reset();
    },
    resetForm() {
      this.setCustomerFullname(null);
      this.setCustomerPhoneNumber(null);
      this.setCustomerSubdivision(null);
      this._filterCustomers = null;
      this._filterSubdivision = null;
    },
  },
  data() {
    return {
      _filterCustomers: null,
      _filterSubdivision: null,
    };
  },
  mounted() {
    this.setCustomerFullname(this.customer.fullname);
    this.setCustomerPhoneNumber(this.customer.phoneNumber);
    this.setCustomerSubdivision(this.customer.subdivision);
  },
  watch: {
    "customer.fullname"() {
      if (this.customer) {
        this.setCustomerFullname(this.customer.fullname);
        this.setCustomerPhoneNumber(this.customer.phoneNumber);
        this.setCustomerSubdivision(this.customer.subdivision);
      }
    },
  },
};
</script>

<style>

</style>
