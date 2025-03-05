<template>
    <div class="positions mt-40">
        <div class="flex jc-fe">
            <base-button
                :disabled="!getUserPermissions.includes('BusinessTravelManagement:positions.new')"
                @click="createPosition"
                classNames="font-button_M button button_blue ml-32"
                >Создать</base-button
            >
        </div>
        <div class="limits__items">
            <base-data-not-available
                v-if="!positions.length && !preloader"
                class="mt-32 pb-40 pt-40 positions__empty"
                title="Нет созданных должностей"
                description="Создайте должность и задайте ее параметры."
                button-text="Создать должность"
                @handle-click="createPosition"
            ></base-data-not-available>
            <div
                v-if="!preloader && positions.length"
                class="mt-40"
            >
                <position-item
                    v-for="item in positions"
                    :key="item.id"
                    :position="item"
                    :disabledEdit="btnEditDisabled"
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
                v-if="positions.length"
                :activePage="searchParams.page"
                :limit="searchParams.pageSize"
                :countRecords="positionsTotalCount"
                @changeActivePage="handleChangeActivePage"
                @changeLimit="handleChangePageSize"
                :isLoading="preloader"
            />
        </div>
    </div>
    <positions-popup-create 
        :showModal="showPopupCreatePosition"
        @close="closePopupCreatePosition"
    />
    <positions-popup-edit 
        :showModal="showPopupEditPosition"
        @close="closePopupEditPosition"
        :formData="editPosition"
    />
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import ThePaginstionControll from '@ui/ThePaginstionControll.vue'

import { usePositionsStore } from '@/store/positions/index.js'
import { useUserStore } from '@/store/user/index.js'
import PositionItem from '@/components/positions/PositionItem.vue'
import PositionsPopupCreate from '@/components/positions/PositionsPopupCreate.vue'
import PositionsPopupEdit from '@/components/positions/PositionsPopupEdit.vue'

const { getUserPermissions } = useUserStore()
const positionsStore = usePositionsStore()

const { positions, preloader, searchParams, positionsTotalCount } = storeToRefs(positionsStore)

const btnEditDisabled = computed(() => {
    return !getUserPermissions.includes('BusinessTravelManagement:positions.write')
})

const showPopupCreatePosition = ref(false)
const closePopupCreatePosition = () => {
    showPopupCreatePosition.value = false
}
const openPopupCreatePosition = () => {
    showPopupCreatePosition.value = true
}
const editPosition = ref(null)

const showPopupEditPosition = ref(false)
const closePopupEditPosition = () => {
    showPopupEditPosition.value = false
}
const openPopupEditPosition = () => {
    showPopupEditPosition.value = true
}

const handleEdit = (data) => {
    editPosition.value = { ...data, departments: [{ ...data.department }] }
    openPopupEditPosition()
}
const createPosition = () => {
    openPopupCreatePosition()
}
const handleChangeActivePage = (value) => {
    searchParams.value.page = value
    positionsStore.fetchPositions()
}
const handleChangePageSize = (value) => {
    searchParams.value.pageSize = value
    searchParams.value.page = 1
    positionsStore.fetchPositions()
}
onMounted(() => {
    positionsStore.fetchPositions()
})
</script>
<style scoped lang="scss">
.positions__empty {
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
