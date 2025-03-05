<template>
    <base-content-wrapper>
        <template v-slot:header>
            <base-wrapper-expanded
                class="mb-32"
                v-model="isSearchOpen"
                placeholder="Поиск командировок"
            >
                <base-search-expanded
                    v-model:tripNumber="tripNumberModel"
                    v-model:startDate="startDateModel"
                    v-model:endDate="endDateModel"
                    v-model:status="statusModel"
                    v-model:toDirectionId="toDirectionIdModel"
                    v-model:userType="userTypeModel"
                    :status-obj="getStatusObj"
                    :user-type-list="Object.values(userTypeGuide)"
                    :preloader="preloader"
                    :start-date-error="getStartDateError"
                    :end-date-error="getEndDateError"
                    @button-click="fetchTrips"
                ></base-search-expanded>
            </base-wrapper-expanded>
        </template>
        <template v-slot:middle>
            <div class="flex-jcsb-aifs mb-24">
                <div style="max-width: 244px">
                    <base-select
                        type="big"
                        label="Дата начала"
                        with-dropdown
                        :value="sort"
                        v-model="isSortOpen"
                    >
                        <base-droplist
                            v-if="isSortOpen"
                            position-x="left"
                            position-y="bottom"
                            :list="sortList"
                            v-model:is-active="isSortOpen"
                            v-model:active-item="sort"
                            type="basic"
                        ></base-droplist>
                    </base-select>
                </div>
                <base-button
                    :disabled="!getUserPermissions.includes('BusinessTravel:trip.new')"
                    @click="createTrip"
                    classNames="font-button_M button button_blue search-button"
                    >Создать командировку</base-button
                >
            </div>
            <base-tabs-tab-bar
                :tabArr="tripTabsArr"
                :activeTabValue="tripsFolder"
                @set-active-tab="setActiveTripTab"
            >
            </base-tabs-tab-bar>
        </template>
        <template v-slot:body>
            <div
                v-if="!preloader"
                class="mt-16"
            >
                <TripItem
                    v-for="trip in getSortTrips"
                    :key="trip.id"
                    :trip="trip"
                    @handleAction="handleAction"
                />
            </div>
            <base-data-not-available
                v-if="!getSortTrips.length && !preloader"
                class="mt-32 pb-40 pt-40"
                :title="dataNotAvailableTitle"
                description="Попробуйте изменить параметры фильтров"
                button-text="Сбросить фильтры"
                @handle-click="clearFilters"
            ></base-data-not-available>
            <template v-if="preloader">
                <div class="mt-16">
                    <base-skeleton
                        v-for="index in 5"
                        :key="index"
                        class="mt-24"
                    />
                </div>
            </template>
            <the-paginstion-controll
                :activePage="page"
                :limit="pageSize"
                :countRecords="currentCountRecords"
                @changeActivePage="handleChangeActivePage"
                @changeLimit="handleChangePageSize"
                :isLoading="preloader"
            />
        </template>
        <template v-slot:footer></template>
    </base-content-wrapper>
    <trip-cancel-popup
        :showModal="showModal"
        @close="onCloseModal"
        @handelCancelAction="handelCancelAction"
        :trip="tripToCancel"
        :type="tripCancelType"
    />
</template>

<script setup>
import BaseContentWrapper from '@ui/wrapper/BaseContentWrapper.vue'
import BaseSearchExpanded from '@ui/search/BaseSearchExpanded.vue'
import BaseWrapperExpanded from '@ui/wrapper/BaseWrapperExpanded.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useTripsStore } from '@/store/trips/index.js'
import { storeToRefs } from 'pinia'
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseDroplist from '@ui/select/BaseDroplist.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import { useUserStore } from '@/store/user/index.js'
import router from '@/router/index.js'
import BaseTabsTabBar from '@ui/tabs/BaseTabsTabBar.vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import { getKeyByValue } from '@/helpers/helpers.js'
import TripItem from '@/views/trips/TripItem.vue'
import ThePaginstionControll from '@ui/ThePaginstionControll.vue'
import TripCancelPopup from '@/views/trips/TripCancelPopup.vue'

const tripsStore = useTripsStore()
const { getUserPermissions } = useUserStore()

const {
    tripNumber,
    startDate,
    endDate,
    status,
    getStatusObj,
    toDirectionId,
    userType,
    userTypeGuide,
    sort,
    sortList,
    tripsFolder,
    tripsCount,
    folderNameGuide,
    preloader,
    getSortTrips,
    getStartDateError,
    getEndDateError,
    page,
    pageSize,
} = storeToRefs(tripsStore)
const { fetchTrips, deleteTrip, sendForApproval, revokeTrip, cancelTrip, rejectTrip, approveTrip, rejectReport } = tripsStore

const isSearchOpen = ref(true)
const isSortOpen = ref(false)

const tripNumberModel = computed({
    get: () => tripNumber.value,
    set: (value) => (tripNumber.value = value),
})
const startDateModel = computed({
    get: () => startDate.value,
    set: (value) => (startDate.value = value),
})
const endDateModel = computed({
    get: () => endDate.value,
    set: (value) => (endDate.value = value),
})
const statusModel = computed({
    get: () => status.value ?? '',
    set: (value) => (status.value = value),
})
const toDirectionIdModel = computed({
    get: () => toDirectionId.value,
    set: (value) => (toDirectionId.value = value),
})
const userTypeModel = computed({
    get: () => (userTypeGuide.value[userType.value] ? userTypeGuide.value[userType.value] : ''),
    set: (value) => {
        getKeyByValue(userTypeGuide.value, value)
            ? (userType.value = getKeyByValue(userTypeGuide.value, value))
            : (userType.value = '')
    },
})

const tripTabsArr = computed(() => {
    let arr = []
    for (const key in folderNameGuide.value) {
        if (key !== 'All') arr.push({ count: tripsCount.value[key], label: folderNameGuide.value[key], value: key })
        else
            arr.push({
                count: Object.values(tripsCount.value).reduce((a, b) => a + b),
                label: folderNameGuide.value[key],
                value: '',
            })
    }
    return arr
})

const dataNotAvailableTitle = computed(() => {
    switch (tripsFolder.value) {
        case 'Upcoming':
            return 'Нет предстоящих командировок'
        case 'OnApproval':
            return 'Нет командировок на согласовании'
        case 'Report':
            return 'Нет командировок для отчетов'
        case 'Complete':
            return 'Нет завершенных командировок'
        default:
            return 'Нет доступных командировок'
    }
})

const createTrip = () => {
    router.push('/trips/create')
}

const setActiveTripTab = (value) => {
    tripsFolder.value = value.value
    page.value = 1
}

const clearFilters = () => {
    tripNumber.value = ''
    startDate.value = ''
    endDate.value = ''
    status.value = ''
    toDirectionId.value = []
    userType.value = ''
    fetchTrips()
}

onMounted(() => {
    fetchTrips()
})

watch(tripsFolder, () => {
    if (status.value) status.value = ''
    fetchTrips()
})

const handleChangeActivePage = (value) => {
    page.value = value
    fetchTrips()
}
const handleChangePageSize = (value) => {
    pageSize.value = value
    page.value = 1
    fetchTrips()
}

const currentCountRecords = computed(() => {
    return tripTabsArr.value.find((item) => item.value === tripsFolder.value)?.['count']
})

const showModal = ref(false)
const onCloseModal = () => {
    showModal.value = false
}

const tripToCancel = ref({})
const tripCancelType = ref('')

const isSuccessfulResponse = (status) => status >= 200 && status <= 299

const handelCancelAction = (id, reason) => {
    switch (tripCancelType.value) {
        case 'Revoke':
            revokeTrip(id, reason).then((status) => isSuccessfulResponse(status) && fetchTrips())
            break

        case 'Cancel':
            cancelTrip(id, reason).then((status) => isSuccessfulResponse(status) && fetchTrips())
            break

        case 'Reject':
            rejectTrip(id, reason).then((status) => isSuccessfulResponse(status) && fetchTrips())
            break
    }
}

const handleAction = (type, id) => {
    switch (type) {
        case 'Delete':
            deleteTrip(id).then((status) => isSuccessfulResponse(status) && fetchTrips())
            break

        case 'SendForApproval':
            sendForApproval(id).then((status) => isSuccessfulResponse(status) && fetchTrips())
            break

        case 'Report':
            sendForApproval(id, true).then((status) => isSuccessfulResponse(status) && fetchTrips())
            break

        case 'Approve':
            approveTrip(id).then((status) => isSuccessfulResponse(status) && fetchTrips())
            break

        case 'ExpensesApprove':
            approveTrip(id, true).then((status) => isSuccessfulResponse(status) && fetchTrips())
            break

        case 'Revoke':
            showModal.value = true
            tripToCancel.value = getSortTrips.value.find((trip) => trip.id === id)
            tripCancelType.value = type
            break

        case 'Reject':
            showModal.value = true
            tripToCancel.value = getSortTrips.value.find((trip) => trip.id === id)
            tripCancelType.value = type
            break

        case 'Cancel':
            showModal.value = true
            tripToCancel.value = getSortTrips.value.find((trip) => trip.id === id)
            tripCancelType.value = type
            break

        case 'History':
            router.push(`/trips/${id}/history`)
            break

        case 'Ticket':
            router.push(`/trips/${id}/tickets`)
            break

        case 'Edit':
            router.push(`/trips/${id}`)
            break

        case 'ExpensesReject':
            rejectReport(id).then((status) => isSuccessfulResponse(status) && fetchTrips())
            break
            
        default:
            break
    }
}
</script>

<style scoped lang="scss"></style>
