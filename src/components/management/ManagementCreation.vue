<template>
  <div class="col column">
    <q-form
      @submit="onSubmit"
      @reset="resetForm"
      class="col column justify-between q-pa-md"
      ref="form"
    >
      <div class="col col-3 row q-mb-md">
        <q-scroll-area class="col">
          <div class="column q-gutter-y-md">
            <q-input
              v-model="_name"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Наименование управления"
              autocomplete="off"
            />
            <q-input
              :disable="true"
              v-model="_defaultLimit"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Ежемесячный лимит"
              autocomplete="off"
            />
            <q-toggle
              v-model="_isMinutes"
              color="green"
              label="Лимит в километрах / минутах"
            />
            <q-input
              v-model.number="__operatingSpeedVariable"
              type="number"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Переменная эксплутационной скорости"
              autocomplete="off"
              :disable="_isMinutes"
              step="0.01"
              :lazy-rules="!_isMinutes"
              :rules="
                !_isMinutes
                  ? [
                      (val) =>
                        (val !== null && val != '' && val >= 0 && val <= 100) ||
                        'Обязательное поле (0.00-100.00)!',
                    ]
                  : null
              "
            />
            <q-checkbox
              v-model="_isSubdivision"
              label="Управление по подразделению"
              dense
              class="q-pa-md"
            />
            <q-select
              v-model="_bossId"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Главный ответственный"
              :options="customers"
              :option-label="(item) => item.fullname"
              :option-value="(item) => item.id"
              clearable
              autocomplete="off"
              :readonly="_isSubdivision"
            />
            <q-select
              v-model="_subdivision"
              type="text"
              square
              outlined
              hide-bottom-space
              hide-hint
              dense
              label-color="grey"
              label="Подразделение"
              :options="_subdivisions"
              clearable
              autocomplete="off"
              :readonly="!_isSubdivision"
            />
          </div>
        </q-scroll-area>
      </div>
      <div class="col column q-mx-md" v-if="management">
        <div>Запросы на пополнение</div>
        <q-separator />
        <div v-for="request in getManagementRequests(management.id)">
          <LimitApprovement :item="request" :isAdmin="true" class="q-my-sm" />
        </div>
      </div>
      <div class="row q-gutter-x-md">
        <q-btn
          v-if="_creationMode && !currentUser?.role.includes('OPERATOR')"
          text-color="white"
          label="Создать"
          unelevated
          class="border-none bg-blue-4 col"
          type="submit"
          no-caps
        />
        <q-btn
          v-if="!_creationMode"
          text-color="white"
          label="Изменить"
          unelevated
          class="border-none bg-blue-4 col"
          type="submit"
          no-caps
        />
        <!-- <q-btn
          v-if="!_creationMode"
          text-color="white"
          label="Удалить"
          unelevated
          class="border-none bg-red col"
          @click="onRemoveManagement"
          no-caps
        /> -->
        <q-btn
          text-color="white"
          label="Отмена"
          unelevated
          class="border-none bg-green col"
          @click="onCancel()"
          no-caps
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import LimitApprovement from "src/components/limits/LimitApprovement.vue";
export default {
  components: {
    LimitApprovement,
  },
  computed: {
    ...mapState("current", ["management"]),
    ...mapState("current", ["currentUser"]),
    ...mapState("customer", ["customers"]),
    ...mapGetters("customer", ["getCustomerById", "subdivisions"]),
    ...mapGetters("hierarchy", ["getManagementRequests"]),
    __operatingSpeedVariable: {
      get() {
        return +this._operatingSpeedVariable;
      },
      set(val) {
        const valWithoutCommaNumberToFixed = val.toFixed(2);
        this._operatingSpeedVariable = +valWithoutCommaNumberToFixed;
      },
    },
    _subdivisions: {
      get() {
        return this.subdivisions.map((s) => s.name);
      },
    },
  },
  methods: {
    ...mapActions("management", [
      "updateManagement",
      "removeManagement",
      "addManagement",
    ]),
    ...mapMutations("current", ["setManagement"]),
    ...mapActions("hierarchy", ["getManagementLimitRequests"]),
    async onAddManagement() {
      await this.addManagement({
        name: this._name,
        defaultLimit: this._defaultLimit,
        operatingSpeedVariable: this.__operatingSpeedVariable,
        isMinutes: this._isMinutes,
        bossId: this._isSubdivision ? null : this._bossId.id,
        subdivision: this._isSubdivision ? this._subdivision : null,
        isSubdivision: this._isSubdivision,
      });
      this.$refs.form.reset();
    },
    async onUpdateManagement() {
      await this.updateManagement({
        id: this.management.id,
        name: this._name,
        defaultLimit: this._defaultLimit,
        operatingSpeedVariable: this.__operatingSpeedVariable,
        isMinutes: this._isMinutes,
        bossId: this._isSubdivision ? null : this._bossId.id,
        subdivision: this._isSubdivision ? this._subdivision : null,
        isSubdivision: this._isSubdivision,
      });
      this.$refs.form.reset();
    },
    async onSubmit() {
      this._creationMode
        ? await this.onAddManagement()
        : await this.onUpdateManagement();
    },
    async onRemoveManagement() {
      await this.removeManagement({ id: this.management.id });
      this.$refs.form.reset();
    },
    resetForm() {
      this._name = null;
      this._defaultLimit = null;
      this._isMinutes = false;
      this.__operatingSpeedVariable = 0;
      this._subdivision = null;
      this._isSubdivision = false;
      this._bossId = null;
      this.$emit("done");
      this.setManagement(null);
    },
    async loadData() {
      if (this.management) {
        this._name = this.management.name;
        this._defaultLimit = this.management.defaultLimit;
        this._isMinutes = this.management.isMinutes;
        this.__operatingSpeedVariable = this.management.operatingSpeedVariable;
        this._subdivision = this.management.subdivision;
        this._isSubdivision = this.management.isSubdivision;
        this._bossId = this.getCustomerById(this.management.bossId);
        await this.getManagementLimitRequests({ id: this.management.id });
        this._creationMode = false;
      } else {
        this._creationMode = true;
      }
    },
    onCancel() {
      this.$refs.form.reset();
    },
  },
  data() {
    return {
      _name: null,
      _defaultLimit: null,
      _operatingSpeedVariable: null,
      _isMinutes: false,
      _bossId: null,
      _subdivision: null,
      _isSubdivision: false,
      _creationMode: true,
      filter: "",
    };
  },
  mounted() {
    this.loadData();
  },
  watch: {
    "management.name"() {
      if (this.management) this.loadData();
    },
    management() {
      this._creationMode = !this.management;
    },
  },
};
</script>

<style></style>
