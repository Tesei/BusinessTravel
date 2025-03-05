<template>
    <div class="mt-24 history-wrapper">
        <template v-if="historyItems.length && !preloader">
            <div
                :key="index"
                v-for="(item, index) in historyItems"
                class="pt-16 pb-16 pl-24 pr-24 bg-gray-6 radius-8 mb-24 history-item"
            >
                <div class="body_S history-item__content">
                    <div>{{ formatUtcToLocalDateTime(item.changeDate) }}</div>
                    <div>
                        {{ getShortName(item.userInfo) }}
                    </div>
                    <div class="flex flex-d-c">
                        <div>{{ getTextByCode(item.code) }}</div>
                        <span
                            v-if="item.comment"
                            class="footnote_L c-gray"
                            >{{ item.comment }}</span
                        >
                    </div>
                </div>
            </div>
        </template>
        <template v-if="preloader">
            <base-skeleton
                v-for="count in 4"
                :key="count"
                skeleton-height="96px"
                class="mb-24 mt-16"
            ></base-skeleton
        ></template>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTripsStore } from '@/store/trips/index.js'
import { storeToRefs } from 'pinia'
import { formatUtcToLocalDateTime } from '@/helpers/helpers.js'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import { getShortName } from '@/helpers/helpers'

const route = useRoute()
const tripId = route.params.tripNumber
const tripsStore = useTripsStore()

const { historyTrip, preloader } = storeToRefs(tripsStore)

const historyItems = computed(() => historyTrip.value.items || [])

onMounted(() => {
    tripsStore.fetchHistoryTrip(tripId)
})

const historyTextMap = {
    Edit: 'Командировка изменена',
    SendForApproval: 'Командировка отправлена на согласование',
    Delete: 'Командировка удалена',
    Revoke: 'Командировка отозвана',
    Revert: 'Командировка возвращена в согласованное состояние',
    Approve: 'Командировка согласована',
    Reject: 'Командировка отклонена',
    Cancel: 'Командировка отменена',
    Ticket: 'Куплен билет',
    History: 'Просмотрена история командировка',
    Report: 'Направлен отчёт по командировке',
    ExpensesApprove: 'Дополнительные расходы согласованы',
    ExpensesReject: 'Дополнительные расходы отклонены',
    ExpensesSendForApproval: 'Дополнительные расходы отправлены на согласование',
}
const getTextByCode = (code) => historyTextMap[code]
</script>

<style scoped lang="scss">
.history-wrapper {
    width: 100%;
}
.history-item {
    width: 100%;

    //.history-item__content
    &__content {
        display: grid;
        grid-template-columns: 130px 160px 1fr;
        column-gap: 32px;
        width: 100%;
        align-items: center;

        //.history-item__content > div
        & > div {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
}
</style>
