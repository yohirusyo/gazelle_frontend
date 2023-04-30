<template>
    <div class="text-h4">{{ currentUser.fullname }}</div>
    <div>{{ myManagement?.name }}</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
    computed: {
        ...mapState('current', ['currentUser']),
        ...mapGetters('management', ['myManagement']),
    }
}
</script>