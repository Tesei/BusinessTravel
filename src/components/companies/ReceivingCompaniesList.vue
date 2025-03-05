<template>
    <base-content-wrapper class="w-100p">
        <template v-slot:header>
            <div class="flex jc-sb ai-c mb-40">
                <h2 class="Heading_2">Принимающие организации</h2>
                <base-button
                    class="button_blue"
                    :disabled="btnCreateDisabled"
                    @click="handleCreateCompany"
                    >Создать
                </base-button>
            </div>
        </template>
        <template v-slot:middle>
            <base-search-simple
                class="mb-40"
                v-model="searchParams.search"
                @handleSearch="handleSearch"
                :maxlen="'150'"
                :placeholder="'Название'"
            />
        </template>
        <template v-slot:body>
            <div v-if="!preloader && getCompaniesItems.length">
                <ReceivingCompaniesItem
                    v-for="item in getCompaniesItems"
                    :key="item.id"
                    :company="item"
                />
            </div>
            <template v-if="preloader">
                <div>
                    <base-skeleton
                        v-for="index in 7"
                        :key="index"
                        class="mb-24"
                    />
                </div>
            </template>
            <base-data-not-available
                v-if="!getCompaniesItems.length && companies.advancedSearch"
                class="mt-32 pb-40 pt-40"
                :title="'Ни одной организации не найдено'"
                description="Попробуйте изменить параметры фильтров"
            ></base-data-not-available>
            <base-data-not-available
                v-if="!getCompaniesItems.length && !companies.advancedSearch"
                class="mt-32 pb-40 pt-40"
                :title="'Нет созданных организаций'"
                description="Создайте принимающую организацию и добавьте ее параметры"
                button-text="Создать организацию"
                @handle-click="() => null"
            ></base-data-not-available>
            <the-paginstion-controll
                v-if="getCompaniesItems.length"
                :activePage="searchParams.page"
                :limit="searchParams.pageSize"
                :countRecords="companies.countRecords"
                @changeActivePage="handleChangeActivePage"
                @changeLimit="handleChangePageSize"
                :isLoading="preloader"
            />
        </template>
    </base-content-wrapper>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import BaseContentWrapper from '@/components/ui/wrapper/BaseContentWrapper.vue'

import BaseButton from '@/components/ui/buttons/BaseButton.vue'
import BaseSearchSimple from '@/components/ui/search/BaseSearchSimple.vue'
import { useCompaniesStore } from '@/store/companies'
import { useUserStore } from '@/store/user/index.js'

import ThePaginstionControll from '@ui/ThePaginstionControll.vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import ReceivingCompaniesItem from '@/components/companies/ReceivingCompaniesItem.vue'

const store = useCompaniesStore()
const { companies, getCompaniesItems, searchParams, preloader } = storeToRefs(store)
const userStore = useUserStore()

onMounted(() => {
    store.fetchCompanies()
})

const btnCreateDisabled = computed(() => {
    return !userStore.getUserPermissions.includes('BusinessTravelManagement:companies.new')
})

const handleChangeActivePage = (value) => {
    store.searchParams.page = value
    store.fetchCompanies()
}

const handleChangePageSize = (value) => {
    store.searchParams.pageSize = value
    store.searchParams.page = 1
    store.fetchCompanies()
}

const handleSearch = () => {
    store.fetchCompanies()
}

const handleCreateCompany = () => {
    console.log('Create')
}
</script>

<style scoped lang="scss">
.btn-delete {
    width: 40px;
    height: 40px;
}
.icon-delete {
    width: 16px;
    height: 16px;
}

.popup__wrapper {
    width: 770px;
}
</style>
