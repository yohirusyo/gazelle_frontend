<template>
    <div>{{ formatPlace(getPlaceById(placeId)) }}</div>
</template>

<script>
import { formatPlace } from 'src/helpers/formatters';
import { mapGetters } from 'vuex';
export default {
    props: ['placeId'],
    methods: {
        formatPlace,
    },
    computed: {
        ...mapGetters('place', ['getPlaceById']),
    }
}
</script>