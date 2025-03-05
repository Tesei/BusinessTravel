<template>
    <base-wrapper-component :is-show-button="false">
        <template #title>Лимиты</template>
        <template #content>
            <BaseSearchSimple
                class="mt-40"
                placeholder="Подразделение или ФИО сотрудника"
                v-model="searchInput"
                @handleSearch="handleSearch"
            />
            <Limits class="w-100p" />
        </template>
    </base-wrapper-component>
</template>
<script setup>
import { ref } from 'vue'

import Limits from '@/components/limits/Limits.vue'
import BaseWrapperComponent from '@/components/ui/wrapper/BaseWrapperComponent.vue'
import BaseSearchSimple from '@ui/search/BaseSearchSimple.vue'

import { storeToRefs } from 'pinia'

import { useLimitsStore } from '@/store/limits'
const limitsStore = useLimitsStore()
const { searchParams, activeTabValue } = storeToRefs(limitsStore)

const searchInput = ref('')

const handleSearch = () => {
    searchParams.value.search = searchInput.value
    limitsStore.fetchLimits(activeTabValue.value)
}
</script>
<style scoped></style>
