<template>
    <div class="p-24 bd bd-gray-9 radius-16 flex flex-d-c ai-fs jc-fs daily-allowances">
        <div class="flex jc-sb ai-c mb-24 daily-allowance__header">
            <h2 class="Heading_4">Суточные</h2>
        </div>
        <div
            class="flex jc-sb ai-c mb-24 daily-allowance__row"
            v-for="item in trip.stages"
            :key="item.id"
        >
            <div class="body_S daily-allowance__location">
                {{ item.toDirection.name }} &nbsp;<span class="body_S"
                    >({{ item?.details?.daysInStage }}
                    {{ inclineFilter(item?.details?.daysInStage, ['день', 'дня', 'дней']) }})</span
                >
            </div>
            <div class="daily-allowance__line"></div>
            <div class="font-button_M flex">{{ item.details?.totalDailyAllowance.toLocaleString('ru') }}&nbsp;<span class="body_S">₽</span></div>
        </div>
        <div class="flex jc-sb ai-c daily-allowance__row">
            <div class="body_S">Всего</div>
            <div class="daily-allowance__line"></div>
            <div class="font-button_M flex">
                {{ trip.stages?.reduce((ac, el) => ac + el.details?.totalDailyAllowance, 0).toLocaleString('ru') }}&nbsp;<span class="body_S">₽</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inclineFilter } from '@/helpers/helpers.js'

const props = defineProps({
    trip: {
        type: Object,
        required: true,
    },
})
</script>

<style scoped lang="scss">
.daily-allowances {
    width: 100%;

    .daily-allowance__row {
        width: 100%;

        .daily-allowance__line {
            height: 12px;
            flex-grow: 1;
            border-bottom: 3px dashed $color-gray-3;
        }
    }
}
</style>
