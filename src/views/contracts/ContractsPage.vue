<template>
    <BaseWrapperBusinesContent
        v-model="search"
        :title="'Договоры'"
        :tabArray="tabArray"
        :activeTab="activeTab"
        :handleSearch="handleSearch"
        :setActiveTab="setActiveTab"
        :textBtnCreate="'Создать договор'"
        @handleCreateContragent="handleCreateContragent"
        :isLoading="loading"
    >
        <Transition>
            <BaseDataNotAvailable
                v-if="!contracts.length && !loading"
                :title="'Нет созданных договоров'"
                :description="'Создайте первый договор и задайте его параметры.'"
                :buttonText="'Создать договор'"
                @handleClick="handleCreateContragent"
            />
        </Transition>
        <ContractsContent />
        <template #footer>
            <ThePaginstionControll
                :activePage="activePage"
                :countRecords="+counts"
                :limit="+pageSize"
                @changeActivePage="(page) => changeActivePage(page)"
                @changeLimit="(limit) => changePageSize(limit)"
                :isLoading="loading"
            />
        </template>
    </BaseWrapperBusinesContent>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import BaseWrapperBusinesContent from '@ui/wrapper/BaseWrapperBusinesContent.vue'
import ContractsContent from '@/components/contracts/ContractsContent.vue'
import ThePaginstionControll from '@ui/ThePaginstionControll.vue'
import { useContractsStore } from '@/store/contracts'
import { storeToRefs } from 'pinia'

const store = useContractsStore()
const { clientCount, providerCount, contracts, loading } = storeToRefs(store)

const search = ref('')
const activePage = ref(1)
const pageSize = ref(3)
const counts = computed(() => (activeTab.value === 'Client' ? clientCount.value : providerCount.value))

const tabArray = computed(() => [
    {
        label: 'Клиент',
        value: 'Client',
        count: clientCount,
    },
    {
        label: 'Поставщик',
        value: 'Provider',
        count: providerCount,
    },
])

const changeActivePage = (page) => {
    activePage.value = page
}

const changePageSize = (count) => {
    pageSize.value = count
}

const activeTab = ref('Client')
const setActiveTab = (tab) => {
    activeTab.value = tab.value
}

onUnmounted(() => {
    store.clearContracts()
})

watch([activeTab, activePage, pageSize], (newValue, oldVal) => {
    if (newValue[0] !== oldVal[0]) {
        changeActivePage(1)
    }
    if (newValue[2] !== oldVal[2]) {
        changeActivePage(1)
    }

    store.fetchContracts({
        page: activePage.value,
        pageSize: pageSize.value,
        search: search.value,
        contractType: activeTab.value,
    })
})

const handleSearch = () => {
    store.fetchContracts({
        page: activePage.value,
        pageSize: pageSize.value,
        search: search.value,
        contractType: activeTab.value,
    })
}

const handleCreateContragent = () => {
    console.log('handleCreateContragent - ')
}
</script>

<style scoped lang="scss">
.title {
    margin-bottom: 40px;
    margin-top: 30px;
}

.row-bar {
    width: 100%;
}

.font-button_M.button.button_transparent {
    white-space: nowrap;
}
.tabs-container {
    width: 100%;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
