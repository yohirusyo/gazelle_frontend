<template>
  <q-page class="bg-white">
    <q-table
      separator="cell"
      flat
      dense
      :filter="filter"
      wrap-cells
      :rows-per-page-options="[0]"
      hide-bottom
      :rows="filteredPlaces"
      :columns="columns"
    >
      <template v-slot:top>
        <div style="font-size: 20px; letter-spacing: 0.005em; font-weight: 400">
          Места погрузки-разгрузки
        </div>
        <q-space />
        <q-btn
          v-if="currentUser.role == 'ADMIN'"
          size="sm"
          color="primary"
          round
          dense
          :icon="'add'"
          class="q-mr-md"
          @click="openAddPopup()"
        >
          <q-tooltip>Создать</q-tooltip>
        </q-btn>
        <q-input
          borderless
          dense
          debounce="300"
          color="primary"
          v-model="filter"
          placeholder="Поиск"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr
          :props="props"
          v-if="
            props.row.manageId == currentUser.managementId ||
            currentUser.role == 'ADMIN'
          "
        >
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
            <div
              class="row justify-center items-center q-gutter-sm"
              v-if="col.name == 'edit'"
            >
              <q-btn
                class="col"
                size="sm"
                
                color="primary"
                @click="openUpdatePopup(props.row)"
                icon="edit"
              >
                <q-tooltip>Редактировать</q-tooltip>
              </q-btn>
              <!-- <q-btn
                size="sm"
                color="red"
                class="col"
                @click="removeRow(props.row)"
                icon="remove"
              >
                <q-tooltip>Удалить</q-tooltip>
              </q-btn> -->
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="dialog">
      <q-card class="q-pa-md" style="min-width: 600px">
        <q-input
          v-model="place.name"
          dense
          outlined
          autofocus
          counter
          placeholder="Название"
        />
        <q-input
          ref="refStartTimeWork"
          outlined
          dense
          v-model="place.startTimeWork"
          mask="time"
          :rules="['time']"
          placeholder="Время начала работы"
        >
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
        <q-input
          ref="refEndTimeWork"
          outlined
          dense
          v-model="place.endTimeWork"
          mask="time"
          :rules="['time']"
          placeholder="Время окончания работы"
        >
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
        <q-input
          ref="refStartTimeLunch"
          outlined
          dense
          v-model="place.startTimeLunch"
          mask="time"
          :rules="['time']"
          placeholder="Время начала обеда"
        >
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
        <q-input
          ref="refEndTimeLunch"
          outlined
          dense
          v-model="place.endTimeLunch"
          mask="time"
          :rules="['time']"
          placeholder="Время окончания обеда"
        >
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
        <q-select
          dense
          outlined
          v-model="place.transportTypes"
          multiple
          :options="transportTypes"
          label="Подходящие типоразмеры"
          option-label="description"
          option-value="id"
        />
        <q-select
          v-if="currentUser.role == 'ADMIN'"
          dense
          outlined
          class="q-mt-md"
          label="Ответственный"
          v-model="place.manageId"
          :options="managements"
          option-label="name"
          emit-value
          map-options
          option-value="id"
        />
        <div class="justify-center q-gutter-sm row q-mt-xs">
          <q-btn
            v-if="!editFlag"
            :disable="place.name == ''"
            label="Создать"
            @click="addRow()"
            text-color="white"
            unelevated
            class="border-none bg-blue-4"
            no-caps
            dense
          ></q-btn>
          <q-btn
            v-if="editFlag"
            :disable="place.name == ''"
            label="Обновить"
            @click="updateRow(place)"
            text-color="white"
            unelevated
            class="border-none bg-blue-4"
            no-caps
            dense
          ></q-btn>
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
        name: "",
        startTimeWork: null,
        endTimeWork: null,
        startTimeLunch: null,
        endTimeLunch: null,
        transportTypes: null,
        manageId: null,
      },
      transportTypes: [],
      filter: "",
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
          classes: "bg-grey-2 ellipsis",
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
          field: (row) =>
            row.transportTypes?.map((t) => t.description).join(", "),
        },
        {
          name: "manageId",
          required: true,
          label: "Отвественный",
          align: "center",
          sortable: false,
          field: (row) =>
            this.managements.filter((m) => m.id == row.manageId)[0]?.name,
        },
        {
          name: "edit",
          align: "center",
          label: "Редактирование",
          style: "width: 100px"
        },
      ],
    };
  },
  methods: {
    ...mapActions("place", [
      "requestPlaces",
      "addPlace",
      "updatePlace",
      "removePlace",
    ]),
    ...mapActions("management", ["requestManagements"]),
    openAddPopup() {
      this.editFlag = false;
      (this.place = {
        name: "",
        startTimeWork: null,
        endTimeWork: null,
        startTimeLunch: null,
        endTimeLunch: null,
        transportTypes: null,
        manageId: null,
      }),
        (this.dialog = true);
    },
    openUpdatePopup(el) {
      this.editFlag = true;
      this.place = el;
      this.dialog = true;
    },
    async addRow() {
      await this.addPlace(this.place);
      await this.requestPlaces(true);
      this.dialog = false;
    },
    async updateRow(el) {
      await this.updatePlace(el);
      await this.requestPlaces(true);
      this.dialog = false;
    },
    async removeRow(el) {
      await this.removePlace(el);
      await this.requestPlaces(true);
      this.dialog = false;
    },
  },
  computed: {
    ...mapState("place", ["places"]),
    ...mapState("management", ["managements"]),
    ...mapState("current", ["currentUser"]),

    filteredPlaces: {
      get() {
        return this.places.filter((p) => !p.isDeleted && p.addedManualy);
      },
    },
  },
  async mounted() {
    Loading.show();
    await this.requestManagements({
      year: dayjs().year(),
      month: dayjs().month(),
    });
    await this.requestPlaces(true);
    const { data } = await api.get("/recommendation/transport-types");
    this.transportTypes = data;
    Loading.hide();
  },
};
</script>

<style>
.q-field--outlined.q-field--readonly .q-field__control:before {
  border-style: solid;
  border: 1px solid black;
}
.q-table--dense .q-table thead tr, .q-table--dense .q-table tbody tr, .q-table--dense .q-table tbody td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
