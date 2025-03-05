<template>
    <base-wrapper-component :is-show-button="false">
        <template #title>Оргструктура</template>
        <template #content>
            <BaseSearchSimple
                class="mt-40"
                placeholder="Название подразделения"
                v-model="searchInput"
                @handleSearch="handleSearch"
            />
            <departments-tree class="w-100p" />
        </template>
    </base-wrapper-component>
</template>
<script setup>
import { ref } from 'vue'

import DepartmentsTree from '@/components/departments/DepartmentsTree.vue'
import BaseWrapperComponent from '@/components/ui/wrapper/BaseWrapperComponent.vue'
import BaseSearchSimple from '@ui/search/BaseSearchSimple.vue'

import { useDepartmentsStore } from '@/store/departments'
const { fetchDepatmentsSearch } = useDepartmentsStore()

const searchInput = ref('')

const handleSearch = () => {
    fetchDepatmentsSearch(searchInput.value)
}
</script>
<style scoped></style>
