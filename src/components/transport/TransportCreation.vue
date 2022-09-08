<template>
  <q-form
    @submit="onAddTransport"
    @reset="resetForm"
    class="col column justify-between"
    ref="form"
  >
    <div class="col row q-mb-md">
      <q-scroll-area class="col">
        <div class="column q-gutter-y-md">
          <q-input
            v-model="_type"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Введите тип ТС"
            :autocomplete="false"
          />
          <q-input
            v-model="_transportNumber"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Введите номер ТС"
            mask="A ### AA ###"
            :autocomplete="false"
          />
          <q-select
            v-model="_place"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Выберите местонахождение транспорта"
            :options="places"
            :option-label="(item) => item.name"
            :option-value="(item) => item.id"
            clearable
            :autocomplete="false"
          >
            <template v-slot:append>
              <q-btn
                color="primary"
                icon="las la-map-marker"
                flat
                rounded
                class="q-ml-sm"
                :disable="!place"
                @click.stop="
                  () => {
                    _place = place;
                    setPlace(null);
                  }
                "
              />
            </template>
          </q-select>
          <q-select
            v-model="_driver"
            type="text"
            borderless
            class="bg-grey-2 border-sm q-pl-md shadow-white-inset"
            hide-bottom-space
            hide-hint
            label-color="grey"
            label="Выберите водителя"
            :options="getFreeDrivers()"
            :option-label="
              (item) =>
                `${item.surname} ${item.name} ${item.middlename} (${item.phoneNumber})`
            "
            :option-value="(item) => item.id"
            clearable
            :autocomplete="false"
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
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
export default {
  name: "TransportCreation",
  methods: {
    ...mapActions("transport", ["addTransport"]),
    ...mapMutations("current", ["setPlace"]),
    async onAddTransport() {
      await this.addTransport({
        type: this._type,
        transportNumber: this._transportNumber,
        placeId: this._place?.id,
        statusId: this.getStatusByCode("FREE").id,
        driverId: this._driver?.id,
      });
      this.$emit("done");
      this.$refs.form.reset();
    },
    resetForm() {
      this._name = null;
    },
  },
  computed: {
    ...mapState("place", ["places"]),
    ...mapState("user", ["drivers"]),
    ...mapGetters("status", ["getStatusByCode"]),
    ...mapGetters("user", ["getFreeDrivers"]),
    ...mapState("current", ["place"]),
  },
  data() {
    return {
      _type: null,
      _transportNumber: null,
      _place: null,
      _driver: null,
    };
  },
};
</script>

<style></style>
