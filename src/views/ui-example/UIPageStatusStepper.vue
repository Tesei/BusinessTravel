<template>
    <div class="p-24">
        <base-status-stepper :steps="stepsArr" />
    </div>
</template>

<script setup>
import BaseStatusStepper from '@ui/status/BaseStatusStepper.vue'

const stepsArr = [
    {
        status: 'Pending',
        title: 'Лермонтов М.Ю',
        description: new Date(),
        id: 1,
    },
    {
        status: '',
        title: 'Лермонтов М.Ю qwe qweqweqweqweqwewqqe',
        description: 'ожидает согласования',
        id: 2,
    },
    {
        status: 'Approved',
        title: 'Лермонтов М.Ю qwe qweqweqweqweqwewqqe',
        description: 'ожидает согласования',
        id: 3,
    },
    {
        status: 'Rejected',
        title: 'Лермонтов М.Ю qwe qweqweqweqweqwewqqe',
        description: 'ожидает согласования',
        id: 4,
    },
    {
        status: '',
        title: 'Лермонтов М.Ю qwe qweqweqweqweqwewqqe',
        description: 'ожидает согласования',
        id: 5,
    },
    {
        status: '',
        title: 'Лермонтов М.Ю qwe qweqweqweqweqwewqqe',
        description: 'ожидает согласования',
        id: 6,
    },
]

</script>

<style scoped lang="scss"></style>
