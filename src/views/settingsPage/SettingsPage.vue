<template>
    <div>
        <h2 class="mb-16 mt-32 Heading_1 title">Настройки</h2>
        <base-tabs-bottom-line :tabArr="availableOptions">
            <template #tab5>
                <h3>Оргструктура</h3>
            </template>
            <template #tab6>
                <h3>Должности</h3>
            </template>
            <template #tab7>
                <h3>Сотрудники</h3>
            </template>
            <template #tab8>
                <DailyAllowanceList/>
            </template>
            <template #tab9>
                <h3>Лимиты</h3>
            </template>
            <template #tab10>
                <h3>Tab-3</h3>
            </template>
            <template #tab11>
                <h3>Tab-3</h3>
            </template>
            <template #tab12>
                <h3>Tab-3</h3>
            </template>
            <template #tab13>
                <h3>Tab-3</h3>
            </template>
            <template #tab14>
                <h3>Tab-3</h3>
            </template>
        </base-tabs-bottom-line>
    </div>
</template>

<script setup>
import BaseTabsBottomLine from '@ui/tabs/BaseTabsBottomLine.vue'
import { useAvailableOptions } from '@/composables/useAvailableOptions'
import DailyAllowanceList from '@/components/dailyAllowances/DailyAllowanceList.vue'

const { availableOptions } = useAvailableOptions()


</script>

<style scoped lang="scss"></style>
