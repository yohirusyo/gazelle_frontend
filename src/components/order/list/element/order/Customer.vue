<template>
    <div>
        {{
    formatCustomerMobileSubdivision(
        getCustomerById(customerId)
)
        }}
        <q-tooltip>
            {{
    formatCustomerMobileFullname(
        getCustomerById(customerId)
)
            }}
            {{
    formatCustomerMobilePhoneNumber(
        getCustomerById(customerId)
)
            }}
        </q-tooltip>
    </div>
</template>

<script>
import { formatCustomerMobileFullname, formatCustomerMobileSubdivision, formatCustomerMobilePhoneNumber } from 'src/helpers/formatters';
import { mapGetters } from 'vuex';
export default {
    props: ['customerId'],
    methods: {
        formatCustomerMobileFullname, formatCustomerMobileSubdivision, formatCustomerMobilePhoneNumber
    },
    computed: {
        ...mapGetters('customer', ['getCustomerById']),
    }
}

</script>