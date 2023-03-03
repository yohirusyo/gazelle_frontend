<template>
    <q-table
        :rows="managements"
        :columns="columns"
        row-key="name"
        wrap-cells
        virtual-scroll
        :rows-per-page-options="[0]"
        hide-bottom
        style="height: 100%"
        ref="scroll"
        flat
        class="my-sticky-header-table"
        dense
        table-header-class="bg-white"
        square
        separator="cell"
    >
        <template v-slot:body="props">
            <q-tr
                :props="props"
                @click="setManagement(props.row)"
                class="text-center"
            >
                <q-td
                    key="name"
                    :props="props"
                >
                    {{ props.row.name }}
                </q-td>
                <q-td
                    key="planMonthLimit"
                    :props="props"
                >
                    {{ props.row.limits[0].plan }}
                </q-td>
                <q-td
                    key="factMonthLimit"
                    :props="props"
                >
                    {{ props.row.limits[0].fact }}
                </q-td>
                <q-td
                    key="isMinutes"
                    :props="props"
                >
                    {{ props.row.isMinutes ? 'Минуты' : 'Километры' }}
                </q-td>
                <q-td
                    key="bossId"
                    :props="props"
                >
                    {{ formatCustomer(getCustomerById(props.row.bossId)) }}
                </q-td>
            </q-tr>
        </template>
    </q-table>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { formatCustomer } from 'src/helpers/formatters'
export default {
    components: {
    },
    props: ["col", "height"],
    methods: {
        ...mapMutations('current', ['setManagement']),
        formatCustomer,
    },
    data() {
        return {
            columns: [
                {
                    name: "name",
                    required: true,
                    label: "Название",
                    align: "center",
                    sortable: false,
                },
                {
                    name: "planMonthLimit",
                    required: true,
                    label: "Плановый месячный лимит",
                    align: "center",
                    sortable: false,
                },
                {
                    name: "factMonthLimit",
                    required: true,
                    label: "Фактический месячный лимит",
                    align: "center",
                    sortable: false,
                },
                {
                    name: "isMinutes",
                    required: true,
                    label: "Единица измерения",
                    align: "center",
                    sortable: false,
                },
                {
                    name: "bossId",
                    required: false,
                    label: "Главный ответственный",
                    align: "center",
                    sortable: false,
                },
            ],
        };
    },
    computed: {
        ...mapState("management", ["managements"]),
        ...mapGetters('customer', ['getCustomerById'])
    },
};
</script>

<style>

</style>
