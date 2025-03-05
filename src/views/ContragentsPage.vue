<template>
    <BaseWrapperBusinesContent
        v-model="contragentsStore.searchParams.search"
        :title="'Контрагенты'"
        :tabArray="tabArray"
        :activeTab="activeTab"
        :handleSearch="handleSearch"
        :setActiveTab="setActiveTab"
        :textBtnCreate="isPermissionCreate ? 'Создать контрагента' : null"
        @handleCreateContragent="handleCreateContragent"
        :isLoading="contragentsStore.contragents.loading"
    >
        <div class="flex flex-d-c ai-c tabs-container">
            <template
                v-for="item in contragentsStore.contragents.items"
                :key="item.id"
            >
                <base-tabs-rounded
                    :id="item.id"
                    :shortName="item.shortName"
                    :itn="item.itn"
                    :iec="item.iec"
                    :isActive="item.isActive"
                    :isBlocked="item.isBlocked"
                    @editContragent="handleEditContragent"
                    @toggleBlocked="handleToggleBlocked"
                    @toggleActive="handleToggleActive"
                    :managementCounterpartiesWrite="isManagementCounterpartiesWrite"
                />
            </template>
        </div>
        <BaseDataNotAvailable
            v-if="!contragentsStore.contragents.items.length && !contragentsStore.contragents.advancedSearch"
            :title="'Нет созданных контрагентов'"
            :description="'Создайте первого контрагента и задайте его параметры.'"
            :buttonText="'Создать контрагента'"
            @handleClick="handleCreateContragent"
        />
        <BaseDataNotAvailable
            v-if="!contragentsStore.contragents.items.length && contragentsStore.contragents.advancedSearch"
            :title="'Контрагенты не найдены'"
            :description="'Попробуйте изменить параметры фильтров'"
        />
        <template #footer>
            <ThePaginstionControll
                :activePage="contragentsStore.searchParams.page"
                :countRecords="contragentsStore.contragents.countRecords"
                :limit="contragentsStore.searchParams.pageSize"
                @changeActivePage="(page) => contragentsStore.changeActivePage(page)"
                @changeLimit="(limit) => contragentsStore.changePageSize(limit)"
                :isLoading="contragentsStore.contragents.loading"
            />
        </template>
    </BaseWrapperBusinesContent>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import BaseTabsRounded from '@ui/tabs/BaseTabsRounded.vue'
import { useContragentsStore } from '@/store/contragents'
import { useUserStore } from '@/store/user'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import BaseWrapperBusinesContent from '@ui/wrapper/BaseWrapperBusinesContent.vue'
import ThePaginstionControll from '@ui/ThePaginstionControll.vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const isPermissionCreate = computed(() => userStore.user.permissions.includes('Management:counterparties.new'))
const isManagementCounterpartiesWrite = computed(() => userStore.user.permissions.includes('Management:counterparties.write'))
const contragentsStore = useContragentsStore()
const router = useRouter()

onMounted(() => {
    contragentsStore.getCounterparties('getAll')
    contragentsStore.getCounterparties()
})

const searchValue = ref('')

const tabArray = computed(() => [
    {
        label: 'Активные',
        value: 'tab1',
        count: contragentsStore.contragents.active,
        // route: '/settings/tab1'
    },
    {
        label: 'Неактивные',
        value: 'tab2',
        count: contragentsStore.contragents.inactive,
        // route: '/settings/tab2'
    },
    {
        label: 'Все',
        value: 'tab3',
        count: contragentsStore.contragents.all,
        // route: '/settings/tab3'
    },
])

const activeTab = ref('tab1')
const setActiveTab = (tab) => {
    if (tab.value === activeTab.value) return
    activeTab.value = tab.value
    switch (tab.value) {
        case 'tab1':
            contragentsStore.searchParams.isActive = true
            break
        case 'tab2':
            contragentsStore.searchParams.isActive = false
            break
        case 'tab3':
            contragentsStore.searchParams.isActive = null
            break
    }
    contragentsStore.searchParams.page = 1
    contragentsStore.getCounterparties()
}
// если нужен живой фильтр по странице
//=====================================
// const filtredData = computed(() => {
//     let filteredItems
//     switch (activeTab.value) {
//         case 'tab1':
//             filteredItems = contragentsStore.contragents.items.filter((item) => item.isActive)
//             break
//         case 'tab2':
//             filteredItems = contragentsStore.contragents.items.filter((item) => !item.isActive)
//             break
//         case 'tab3':
//             filteredItems = contragentsStore.contragents.items
//             break
//         default:
//             filteredItems = contragentsStore.contragents.items
//     }

//     const filterItems = (items, searchString) => {
//         return items.filter(
//             (item) =>
//                 item.shortName.toLowerCase().includes(searchString.toLowerCase()) ||
//                 item.itn.toLowerCase().includes(searchString.toLowerCase()),
//         )
//     }
//     return filterItems(filteredItems, searchValue.value)
// })

const handleEditContragent = (id) => {
    console.log('handleEditContragent - ', id)
}
const handleToggleActive = (id) => {
    console.log('handleToggleActive - ', id)
    contragentsStore.toggleActiveOrBlock(id, 'isActive')
}
const handleToggleBlocked = (id) => {
    console.log('handleToggleBlocked - ', id)
    contragentsStore.toggleActiveOrBlock(id, 'isBlocked')
}

const handleSearch = () => {
    console.log('handleSearch - ', searchValue.value)
    contragentsStore.getCounterparties()
    // searchValue.value = ''
}

const handleCreateContragent = () => {
    router.push('/contragents-create')
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
</style>
