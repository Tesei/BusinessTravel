<template>
    <base-content-wrapper class="w-100p">
        <template v-slot:header>
            <div class="flex jc-sb ai-c mt-32 mb-40">
                <h2 class="Heading_2">Суточные</h2>
                <base-button
                    :disabled="btnCreateDisabled"
                    classNames="font-button_M button button_blue"
                    @click="handleCreate"
                    >Создать
                </base-button>
            </div>
        </template>
        <template v-slot:middle>
            <base-search-simple
                class="mb-40"
                v-model="searchParams.search"
                @handleSearch="handleSearch"
                :maxlen="'200'"
                :placeholder="'Подразделение или ФИО сотрудника'"
            />
        </template>
        <template v-slot:body>
            <div v-if="!preloader && getDailyAllowancesArray.length">
                <div class="flex jc-sb ai-c mb-40">
                    <div class="flex">
                        <BaseCheckbox
                            v-model="checkAll"
                            :label="'Выбрать все'"
                            :indeterminate="indeterminate"
                        />
                    </div>
                    <div
                        v-if="!isSomeChecked"
                        class="bd bd-gray-2 radius-8 flex jc-c ai-c btn-delete"
                    >
                        <IconSprite
                            name="delete"
                            class="icon-delete"
                        />
                    </div>
                    <base-button-with-icon
                        v-else
                        @click="openPopup"
                        class="font-button_M bd bd-red tr-all-3 c-red"
                        :iconName="'common--delete'"
                        >Удалить выбранные суточные
                    </base-button-with-icon>
                </div>
                <DailyAllowanceItem
                    v-for="item in getDailyAllowancesArray"
                    :key="item.id"
                    :dailyAllowance="item"
                    :disabledEdit="disabledEdit"
                    v-model:isChecked="item.isChecked"
                    @handleEdit="handleEdit"
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
                v-if="!getDailyAllowancesArray.length && dailyAllowances.advancedSearch"
                class="mt-32 pb-40 pt-40"
                :title="'Суточные не найдены'"
                description="Попробуйте изменить параметры фильтров"
            ></base-data-not-available>
            <base-data-not-available
                v-if="!getDailyAllowancesArray.length && !dailyAllowances.advancedSearch"
                class="mt-32 pb-40 pt-40"
                :title="'Нет созданных суточных'"
                description="Создайте суточные и добавьте параметры"
                button-text="Создать суточные"
                @handle-click="handleCreate"
            ></base-data-not-available>
            <the-paginstion-controll
                v-if="getDailyAllowancesArray.length"
                :activePage="searchParams.page"
                :limit="searchParams.pageSize"
                :countRecords="dailyAllowances.countRecords"
                @changeActivePage="handleChangeActivePage"
                @changeLimit="handleChangePageSize"
                :isLoading="preloader"
            />
        </template>
    </base-content-wrapper>
    <base-wrapper-popup
        v-if="showRemoveDailyAllowancePopup"
        :hasCloseIcon="false"
        @close="closePopup"
    >
        <div class="popup__wrapper p-24 flex flex-d-c">
            <div class="Heading_3 mb-32">Удаление суточных</div>
            <div class="body_S mb-32">Нельзя будет оформить командировки в направления, где не заданы суточные</div>
            <div class="popup__wrapper_footer flex jc-c ai-c">
                <base-button
                    @click="removeDailyAllowance"
                    class="bd c-red font-button_M mr-32"
                    >Удалить</base-button
                >
                <base-button
                    @click="closePopup"
                    classNames="button button_blue font-button_M"
                    >Отмена</base-button
                >
            </div>
        </div>
    </base-wrapper-popup>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import BaseContentWrapper from '@/components/ui/wrapper/BaseContentWrapper.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'

import DailyAllowanceItem from '@/components/dailyAllowances/DailyAllowanceItem.vue'
import BaseButton from '@/components/ui/buttons/BaseButton.vue'
import BaseButtonWithIcon from '@/components/ui/buttons/BaseButtonWithIcon.vue'
import BaseSearchSimple from '@/components/ui/search/BaseSearchSimple.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import { useAllowancesStore } from '@/store/allowance'
import { useUserStore } from '@/store/user/index.js'
import { useRouter } from 'vue-router'
import BaseWrapperPopup from '@ui/wrapper/BaseWrapperPopup.vue'
import ThePaginstionControll from '@ui/ThePaginstionControll.vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'

const dailyAllowancesStore = useAllowancesStore()
const { 
    checkAll, 
    dailyAllowances,
    indeterminate, 
    isSomeChecked, 
    searchParams,
    getDailyAllowancesArray,
    preloader, 
} = storeToRefs(dailyAllowancesStore)
const userStore = useUserStore()

onMounted(() => {
    dailyAllowancesStore.fetchDailyAllowances()
})
const router = useRouter()

const showRemoveDailyAllowancePopup = ref(false)
const openPopup = () => (showRemoveDailyAllowancePopup.value = true)
const closePopup = () => (showRemoveDailyAllowancePopup.value = false)

const btnCreateDisabled = computed(() => {
    return !userStore.getUserPermissions.includes('BusinessTravel:trip.new')
})

const disabledEdit = computed(() => {
    return !userStore.getUserPermissions.includes('BusinessTravelManagement:daily-allowances.write')
})

const handleChangeActivePage = (value) => {
    dailyAllowancesStore.searchParams.page = value
    dailyAllowancesStore.fetchDailyAllowances()
}

const handleChangePageSize = (value) => {
    dailyAllowancesStore.searchParams.pageSize = value
    dailyAllowancesStore.searchParams.page = 1
    dailyAllowancesStore.fetchDailyAllowances()
}

const handleEdit = (id) => {
    router.push({
        name: 'daily-allowance-form-form-edit',
        params: { id },
    })
}

const handleSearch = () => {
    dailyAllowancesStore.fetchDailyAllowances()
}

const handleCreate = () => {
    router.push({ name: 'daily-allowance-form-create' })
}

const removeDailyAllowance = () => {
    //TODO: добавить метод, как будет реализовано удаление на бэке
    console.log(
        'handleDelete',
        getDailyAllowancesArray.value.filter((item) => item.isChecked).map((item) => item.id),
    )
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
