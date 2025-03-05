<template>
    <div class="limits mt-40">
        <div class="flex jc-sb">
            <base-tabs-tab-bar
                classNames="tab-bar tab-bar-numbers tab-bar-limits"
                :tabArr="tripTabsArr"
                :activeTabValue="activeTabValue"
                @set-active-tab="setActiveTab"
            >
            </base-tabs-tab-bar>
            <base-button
                :disabled="!getUserPermissions.includes('BusinessTravelManagement:limits.new')"
                @click="createLimit"
                classNames="font-button_M button button_blue ml-32"
                >Создать</base-button
            >
        </div>
        <div class="limits__items">
            <base-data-not-available
                v-if="!limits.length && !preloader"
                class="mt-32 pb-40 pt-40 limits__empty"
                title="Нет созданных лимитов"
                description="Попробуйте изменить параметры фильтров"
                button-text="Создать лимит"
                @handle-click="createLimit"
            ></base-data-not-available>
            <div
                v-if="!preloader && limits.length"
                class="mt-40"
            >
                <limits-item
                    v-for="item in limits"
                    :key="item.id"
                    :limit="item"
                    @handleEdit="handleEdit"
                />
            </div>
            <template v-if="preloader">
                <div class="mt-40">
                    <base-skeleton
                        v-for="index in 7"
                        :key="index"
                        class="mb-24"
                    />
                </div>
            </template>
            <the-paginstion-controll
                v-if="limits.length"
                :activePage="searchParams.page"
                :limit="searchParams.pageSize"
                :countRecords="currentTotalCount"
                @changeActivePage="handleChangeActivePage"
                @changeLimit="handleChangePageSize"
                :isLoading="preloader"
            />
        </div>
    </div>
</template>
<script setup>
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseTabsTabBar from '@ui/tabs/BaseTabsTabBar.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import ThePaginstionControll from '@ui/ThePaginstionControll.vue'

import { useLimitsStore } from '@/store/limits/index.js'
import { useUserStore } from '@/store/user/index.js'
import LimitsItem from '@/components/limits/LimitsItem.vue'

const router = useRouter()
const { getUserPermissions } = useUserStore()
const limitsStore = useLimitsStore()
const { limitsCount, folderNameGuide, preloader, limits, searchParams, currentTotalCount, activeTabValue } =
    storeToRefs(limitsStore)

const tripTabsArr = computed(() => {
    let arr = []
    for (const key in folderNameGuide.value) {
        if (key !== 'All') arr.push({ count: limitsCount.value[key], label: folderNameGuide.value[key], value: key })
        else
            arr.push({
                count: Object.values(limitsCount.value).reduce((a, b) => a + b),
                label: folderNameGuide.value[key],
                value: '',
            })
    }
    return arr
})

const setActiveTab = (tab) => {
    activeTabValue.value = tab.value
    limitsStore.fetchLimits(tab.value)
}
const createLimit = () => {
    router.push({name: 'limits-form-create'})
}

const handleEdit = (id) => {
    router.push({name: 'limits-form-edit', params: {id}})
    
}
const handleChangeActivePage = (value) => {
    searchParams.value.page = value
    limitsStore.fetchLimits(activeTabValue.value)
}
const handleChangePageSize = (value) => {
    searchParams.value.pageSize = value
    searchParams.value.page = 1
    limitsStore.fetchLimits(activeTabValue.value)
}
onMounted(() => {
    limitsStore.fetchLimits(activeTabValue.value)
})
</script>
<style scoped lang="scss">
.limits__empty {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.btn-delete {
    width: 40px;
    height: 40px;
}
.icon-delete {
    width: 16px;
    height: 16px;
}
</style>
