<template>
    <div class="trip-card-content">
        <trip-card-stages-approval />
        <div>
            <base-tabs-tab-bar
                :tabArr="tabs"
                :activeTabValue="activeTab"
                @setActiveTab="setActiveTab"
            >
                <template #tab1>
                    <trip-card-content-info @change-tab="activeTab = $event" />
                </template>
                <template #tab2>
                    <trip-card-content-tickets class="mt-24 w-100p" />
                    <air-ticket-for-download
                        v-if="trip.services"
                        :tripServices="trip.services"
                        :tripNumber="trip.id"
                    />
                </template>
                <template #tab3>
                    <trip-card-content-history />
                </template>
            </base-tabs-tab-bar>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseTabsTabBar from '@ui/tabs/BaseTabsTabBar.vue'
import TripCardContentInfo from '@/components/trips/tripCard/tripCardContentInfo/TripCardContentInfo.vue'
import TripCardStagesApproval from '@/components/trips/tripCard/TripCardStagesApproval.vue'
import AirTicketForDownload from '@/components/airSearch/AirTicketForDownload.vue'
import TripCardContentHistory from '@/components/trips/tripCard/tripCardContentHistory/TripCardContentHistory.vue'
import TripCardContentTickets from '@/components/trips/tripCard/tripCardContentTickets/TripCardContentTickets.vue'

const props = defineProps({
    trip: { type: Object, required: true },
    actions: { type: Object, required: true },
})

const route = useRoute()
const activeTab = ref('tab1')
const avalableStatusForTicketsTab = [
    'Approved',
    'InProgress',
    'Report',
    'ExpenseApproval',
    'RejectedReport',
    'Canceled',
    'Completed',
]

const getTicketsCount = computed(
    () => props.trip?.services?.filter((el) => el.status === 'None' || el.status === 'New' || el.status === 'Ordered').length || '0',
)

const actionsIncludesHistory = computed(() => props.actions?.includes('History'))
const isStatusDraft = computed(() => props.trip.status === 'Draft')

watch(
    () => [route.path, props.trip.status, props.actions],
    () => {
        if (route.path.includes('/history') && actionsIncludesHistory.value && !isStatusDraft.value) {
            activeTab.value = 'tab3'
        } else if (route.path.includes('/tickets')) {
            activeTab.value = 'tab2'
        } else {
            activeTab.value = 'tab1'
        }
    },
    { immediate: true },
)

const tabs = computed(() => {
    let arrTabs = [{ label: 'Общая информация', value: 'tab1' }]
    if (avalableStatusForTicketsTab.includes(props.trip.status)) {
        arrTabs.push({ label: 'Билеты', value: 'tab2', count: getTicketsCount.value })
    }

    if (!isStatusDraft.value && actionsIncludesHistory.value) {
        arrTabs.push({ label: 'История', value: 'tab3' })
    }

    return arrTabs
})
const setActiveTab = (tab) => {
    if (tab.value !== activeTab.value) {
        activeTab.value = tab.value
    }
}
</script>

<style scoped lang="scss">
.trip-card-content {
    display: grid;
    grid-template-columns: 370px 760px;
    column-gap: 40px;
}

</style>
