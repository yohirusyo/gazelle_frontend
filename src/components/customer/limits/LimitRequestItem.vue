<template>
    <div class="row">
        <div class="col-6">{{ item?.amount }}</div>
        <div class="col-6">{{ item?.approved? 'Принята': (item?.declined ? 'Отклонена' : 'Не рассмотрена') }}</div>
    </div>
</template>

<script>

export default {
    props: ['item'],

}
</script>