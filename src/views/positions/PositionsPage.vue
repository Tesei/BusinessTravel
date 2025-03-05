<template>
    <base-wrapper-component :is-show-button="false">
        <template #title>Должности</template>
        <template #content>
            <BaseSearchSimple
                class="mt-40"
                placeholder="Название должности"
                v-model="searchInput"
                @handleSearch="handleSearch"
                maxlen="128"
            />
            <PositionsList class="w-100p" />
        </template>
    </base-wrapper-component>
</template>
<script setup>
import { ref } from 'vue'

import BaseWrapperComponent from '@/components/ui/wrapper/BaseWrapperComponent.vue'
import BaseSearchSimple from '@ui/search/BaseSearchSimple.vue'
import PositionsList from '@/components/positions/PositionsList.vue'

import { storeToRefs } from 'pinia'

import { usePositionsStore } from '@/store/positions'
const positionsStore = usePositionsStore()
const { searchParams } = storeToRefs(positionsStore)

const searchInput = ref('')

const handleSearch = () => {
    searchParams.value.search = searchInput.value
    positionsStore.fetchPositions()
}
</script>
<style scoped></style>
