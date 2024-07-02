<template>
  <q-table
    class="q-ma-sm"
    separator="cell"
    flat
    bordered
    dense
    :rows-per-page-options="[0]"
    hide-bottom
    :rows="monthLimitSubdivisions"
    :columns="columns"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="subdivsion" :props="props">{{
          props.row.management.name
        }}</q-td>
        <q-td key="percentage" :props="props"
          >{{ toFixed(props.row.percentage) }}
          <q-popup-edit
            v-model="props.row.percentage"
            title="Изменить долю"
            v-slot="scope"
            class="bg-grey-2 text-center"
          >
            <q-input
              type="number"
              v-model="scope.value"
              @update:model-value="(val) => Number(val)"
              dense
              autofocus
              square
              outlined
              hide-bottom-space
              hide-hint
              :rules="[
                (val) =>
                  val <= Number(scope.initialValue) + _percentage ||
                  `Введите число меньше, чем ${
                    _percentage + Number(scope.initialValue)
                  }`,
              ]"
            />
            <q-btn
              :disable="scope.value >= Number(scope.initialValue) + _percentage"
              @click="setLimitSubdivision(scope, props, 'fact')"
              text-color="white"
              label="Изменить"
              unelevated
              class="border-none bg-blue-4 col q-mt-sm"
              no-caps
              dense
            />
            <q-btn
              v-close-popup
              popup-close
              text-color="white"
              label="Отменить"
              unelevated
              class="border-none bg-red-4 col q-mt-sm q-ml-sm"
              no-caps
              dense
            />
          </q-popup-edit>
        </q-td>
        <q-td key="limit" :props="props"
          >{{ toFixed(props.row.fact) }}
          <q-popup-edit
            v-model="props.row.fact"
            title="Изменить долю"
            v-slot="scope"
            class="bg-grey-2 text-center"
          >
            <q-input
              @update:model-value="(val) => Number(val)"
              type="number"
              v-model="scope.value"
              dense
              autofocus
              square
              outlined
              hide-bottom-space
              hide-hint
              :rules="[
                (val) =>
                  val <= Number(scope.initialValue) + _fact ||
                  `Введите число меньше, чем ${
                    _fact + Number(scope.initialValue)
                  }`,
              ]"
            />
            <q-btn
              :disable="scope.value >= Number(scope.initialValue) + _fact"
              @click="setLimitSubdivision(scope, props, 'percentage')"
              text-color="white"
              label="Изменить"
              unelevated
              class="border-none bg-blue-4 col q-mt-sm"
              no-caps
              dense
            />
            <q-btn
              v-close-popup
              popup-close
              text-color="white"
              label="Отменить"
              unelevated
              class="border-none bg-red-4 col q-mt-sm q-ml-sm"
              no-caps
              dense
            />
          </q-popup-edit>
        </q-td>
          <q-td key="technologicalTransport" class="text-center">
            {{ toFixed(props.row.technologicalTransport) }}
            <q-popup-edit
              v-model="props.row.technologicalTransport"
              title="Изменить"
              v-slot="scope"
              class="bg-grey-2 text-center"
            >
                <q-input
                    type="number"
                    v-model="scope.value"
                    dense
                    autofocus
                    square
                    outlined
                    hide-bottom-space
                    hide-hint
                />
                <q-btn
                  @click="setTechnological(scope, props, 'technologicalTransport')"
                  text-color="white"
                  label="Изменить"
                  unelevated
                  class="border-none bg-blue-4 col q-mt-sm"
                  no-caps
                  dense
                />
              <q-btn
                  v-close-popup
                  popup-close
                  text-color="white"
                  label="Отменить"
                  unelevated
                  class="border-none bg-red-4 col q-mt-sm q-ml-sm"
                  no-caps
                  dense
              />
            </q-popup-edit>
          </q-td>
        <q-td class="text-center">
         {{ toFixed(Number(props.row.fact) - props.row.technologicalTransport) }}
        </q-td>
      </q-tr>
    </template>
    <template v-slot:bottom-row>
      <q-tr>
        <q-td class="text-center"> Запас </q-td>
        <q-td class="text-center">{{ _percentage.toFixed(2) }}</q-td>
        <q-td class="text-center">{{ _fact.toFixed(2) }}</q-td>
        <q-td class="text-center">-</q-td>
        <q-td class="text-center">{{ _fact.toFixed(2) }}</q-td>
      </q-tr>
      <q-tr>
        <q-td class="text-center">Общий итог </q-td>
        <q-td class="text-center">100</q-td>
        <q-td class="text-center">{{ factVolume.toFixed(2) }}</q-td>
        <q-td class="text-center">{{ _technologicalTransport.toFixed(2) }}</q-td>
        <q-td class="text-center">{{ (Number(factVolume) - Number(_technologicalTransport)).toFixed(2) }}</q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

import _ from "lodash";
export default {
  name: "limit-table",
  components: {},
  props: ["fact", "year", "month"],

  data() {
    return {
      columns: [
        {
          name: "subdivsion",
          required: true,
          label: "Подразделение",
          align: "center",
          sortable: false,
        },
        {
          name: "percentage",
          required: true,
          label: "Доля",
          align: "center",
          sortable: false,
        },
        {
          name: "limit",
          required: true,
          label: "Транспорт общего назначения",
          align: "center",
          sortable: false,
        },
        {
          name: "technologicalTransport",
          required: true,
          label: "Технологический транспорт",
          align: "center",
          sortable: false,
        },
        {
          name: "ssum",
          required: true,
          label: "Итого",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
  methods: {
    ...mapActions("limit", ["getMonthLimitSubdivisions"]),
    ...mapMutations("limit", ["setLimit", "setTechnologicalTransportLimit", "setAllControlLimitsWithFactVolume"]),
    toFixed(val) {
      if (val) {
        return Number(val).toFixed(2);
      }
    },
    setLimitSubdivision(scope, val, string) {
      scope.set();
      const rowKey = val.row[string];
      const value = (rowKey / Number(scope.initialValue)) * scope.value;
      this.setLimit({
        value: Number(value),
        id: val.row.id,
        string,
        scope: scope.value
      });
    },

    setTechnological(scope, val, string) {
      scope.set();
      const rowKey = val.row[string];
      this.setTechnologicalTransportLimit({
        value: Number(rowKey),
        id: val.row.id,
        string,
        scope: scope.value
      });
    }
  },
  computed: {
    ...mapState("limit", ["monthLimitSubdivisions"]),
    factVolume: {
      get() {
        return this.fact * 1.12607971119134;
      },
    },
    _percentage: {
      get() {
        return (
          100 -
          _.sumBy(this.monthLimitSubdivisions, function (o) {
            return Number(o.percentage);
          })
        );
      },
    },
    _fact: {
      get() {
        return (
          this.factVolume -
          _.sumBy(this.monthLimitSubdivisions, function (o) {
            return Number(o.fact);
          })
        );
      },
    },
    _technologicalTransport: {
      get() {
        return(
          _.sumBy(this.monthLimitSubdivisions, function (o) {
            return Number(o.technologicalTransport)
          })
        );
      },
    },
    _ssum: {
      get() {
        return(
          _.sumBy(this.monthLimitSubdivisions, function (o) {
            return Number(o.technologicalTransport)
          })
        )
      }
    }
  },
  watch: {
    factVolume() {
     this.setAllControlLimitsWithFactVolume(this.factVolume)
    }
  }
};
</script>
