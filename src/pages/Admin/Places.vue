<template>
  <q-page class="row bg-white">
    <q-table style="border-top: 1px solid rgba(0, 0, 0, 0.12)" separator="cell" flat dense :filter="filter" wrap-cells
      :rows-per-page-options="[0]" hide-bottom :rows="places" :columns="columns">
      <template v-slot:top>
        <div style="font-size: 20px; letter-spacing: 0.005em; font-weight: 400;">
          Места погрузки-разгрузки
        </div>
        <q-space />
        <q-btn size="sm" color="primary" round dense :icon="'add'" class="q-mr-md" @click="openAddPopup()">
          <q-tooltip >Создать</q-tooltip>
        </q-btn>

        <q-input borderless dense debounce="300" color="primary" v-model="filter" placeholder="Поиск">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="primary" round dense @click="openUpdatePopup(props.row)" :icon="'edit'" > <q-tooltip >Редактировать</q-tooltip>
            </q-btn> 
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="primary" round dense @click="removeRow(props.row)" :icon="'remove'" >
              <q-tooltip >Удалить</q-tooltip> </q-btn>
          </q-td>
        </q-tr>


      </template>
    </q-table>
    <q-dialog v-model="dialog">
          <q-card class="q-pa-md">
            <q-input v-model="place.name" dense autofocus counter placeholder="Название" />
            <q-input ref="refStartTimeWork" dense v-model="place.startTimeWork" mask="time" :rules="['time']"
              placeholder="Время начала работы">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="place.startTimeWork">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input ref="refEndTimeWork" dense v-model="place.endTimeWork" mask="time" :rules="['time']"
              placeholder="Время окончания работы">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="place.endTimeWork">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input ref="refStartTimeLunch" dense v-model="place.startTimeLunch" mask="time" :rules="['time']"
              placeholder="Время начала обеда">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="place.startTimeLunch">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input ref="refEndTimeLunch" dense v-model="place.endTimeLunch" mask="time" :rules="['time']"
              placeholder="Время окончания обеда">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="place.endTimeLunch">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select dense v-model="place.transportTypes" multiple :options="transportTypes"
              label="Подходящие типоразмеры" option-label="description" option-value="id" />
            <div class="justify-center q-gutter-sm row q-mt-xs">
              <q-btn v-if="!editFlag" :disable="place.name == ''" label="Создать" @click="addRow()" text-color="white"
                unelevated class="border-none bg-blue-4" no-caps dense></q-btn>
              <q-btn v-if="editFlag" :disable="place.name == ''" label="Обновить" @click="updateRow(place)"
                text-color="white" unelevated class="border-none bg-blue-4" no-caps dense></q-btn>
              <!-- <q-btn label="Отмена" @click="$refs.popupRef.hide()" text-color="white" unelevated
                class="border-none bg-green" no-caps dense></q-btn> -->
            </div>
          </q-card>
        </q-dialog>
  </q-page>
</template>

<script>
import { api } from "src/boot/axios";
import { mapActions, mapState } from "vuex";
import { Loading } from "quasar";
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.extend(objectSupport);

export default {
  name: "Places",
  data() {
    return {
      dialog: false,
      place: {
        name: '',
        startTimeWork: null,
        endTimeWork: null,
        startTimeLunch: null,
        endTimeLunch: null,
        transportTypes: null,
      },
      transportTypes: [],
      filter: '',
      editFlag: false,
      columns: [
        {
          name: "name",
          required: true,
          label: "Название",
          align: "center",
          sortable: false,
          style: "width: 300px",
          field: (row) => row.name,
          classes: 'bg-grey-2 ellipsis',
        },
        {
          name: "startTimeWork",
          required: true,
          label: "Время начала работы",
          align: "center",
          sortable: false,
          style: "width: 100px",
          field: (row) => row.startTimeWork?.slice(0, 5),
        },
        {
          name: "endTimeWork",
          required: true,
          label: "Время окончания работы",
          align: "center",
          sortable: false,
          style: "width: 100px",
          field: (row) => row.endTimeWork?.slice(0, 5),
        },
        {
          name: "startTimeLunch",
          required: true,
          label: "Время начала обеда",
          align: "center",
          sortable: false,
          style: "width: 100px",
          field: (row) => row.startTimeLunch?.slice(0, 5),
        },
        {
          name: "endTimeLunch",
          required: true,
          label: "Время окончания обеда",
          align: "center",
          sortable: false,
          style: "width: 100px",
          field: (row) => row.endTimeLunch?.slice(0, 5),
        },
        {
          name: "transportTypes",
          required: true,
          label: "Подходящие типоразмеры",
          align: "center",
          sortable: false,
          field: (row) => row.transportTypes?.map((t) => (t.description)).join(", "),
        },
      ],
    }
  },
  methods: {
    ...mapActions("place", ["requestPlaces", "addPlace", "updatePlace", "removePlace"]),
    openAddPopup() {
      this.editFlag = false
      this.place = {
        name: '',
        startTimeWork: null,
        endTimeWork: null,
        startTimeLunch: null,
        endTimeLunch: null,
        transportTypes: null,
      },
        this.dialog = true
    },
    openUpdatePopup(el) {
      this.editFlag = true
      this.place = el
      this.dialog = true
    },
    async addRow() {
      await this.addPlace(this.place);
      await this.requestPlaces(true);
      this.dialog = false
    },
    async updateRow(el) {
      await this.updatePlace(el);
      await this.requestPlaces(true);
      this.dialog = false
    },
    async removeRow(el) {
      await this.removePlace(el);
      await this.requestPlaces(true);
      this.dialog = false
    }
  },
  computed: {
    ...mapState("place", ["places"]),
  },
  async mounted() {
    Loading.show();
    await this.requestPlaces(true);
    const { data } = await api.get("/recommendation/transport-types");
    this.transportTypes = data;
    Loading.hide();
  },
};
</script>
