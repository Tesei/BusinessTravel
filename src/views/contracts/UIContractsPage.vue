<template>
        <InfoTable
            :classNames="'mt-32 mb-32'"
            :services="propsContentServices"
            :header="header"
        />
</template>

<script setup>
import InfoTable from '@ui/table/InfoTable.vue'
import { computed, ref } from 'vue'

const header = ['Услуга', 'Операция', 'Маршрут', 'Тип операции', 'Сумма сбора']

const testServices = ref([
    {
        expenseType: 'Plane',
        routeType: 'Single',
        operationType: 'Online',
        operationDetails: [
            {
                type: 'Buy',
                feeAmount: 150000,
                feeVatType: 'WithoutVat',
            },
        ],
    },
    {
        expenseType: 'Plane',
        routeType: 'Длинный текст тест',
        operationType: 'Offline',
        operationDetails: [
            {
                type: 'Buy',
                feeAmount: 1500200,
                feeVatType: 'WithoutVat',
            },
        ],
    },
    {
        expenseType: 'Plane',
        routeType: 'Single',
        operationType: 'Online',
        operationDetails: [],
    },
])

const propsContentServices = computed(() =>
    testServices.value.map((service) => [
        service.expenseType,
        service.operationDetails[0]?.type,
        service.routeType,
        service.operationType,
        service.operationDetails[0]?.feeAmount.toLocaleString('ru'),
    ]),
)
</script>

<style lang="scss" scoped></style>
