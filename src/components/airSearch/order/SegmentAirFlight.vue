<template>
    <div class="item4">
        <div class="footnote_L">{{ aviaComany.name }} {{ aviaComany.code }} {{ segment.flightNumber }}</div>
        <div class="footnote_M c-gray">В пути: {{ travelTime }}</div>
    </div>
    <div class="item5">
        <div class="Heading_5">{{ departureTime }}</div>
        <div class="footnote_M c-gray">{{ departureDate }}</div>
    </div>
    <div class="item6">
        <div class="Heading_5">{{ departureAirport.cityName }}</div>
        <div class="footnote_M c-gray">{{ departureAirport.name }}, {{ departureAirport.code }}</div>
    </div>
    <div class="item7">
        <div class="Heading_5">{{ arrivalTime }}</div>
        <div class="footnote_M c-gray">{{ arrivalDate }}</div>
    </div>
    <div class="item8">
        <div class="Heading_5">{{ arrivalAirport.cityName }}</div>
        <div class="footnote_M c-gray">{{ arrivalAirport.name }}, {{ arrivalAirport.code }}</div>
    </div>
    <div
        class="item-fullwidth"
        v-if="isTransfer(idx)"
    >
        <div>
            <IconSprite
                name="common--time-1"
                className="icon__svg"
            />
        </div>
        <div class="footnote_L">Пересадка в г. {{ arrivalAirport.cityName }} {{ durationTime }}</div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { useAirSearchStore } from '@/store/airSearch'
import { storeToRefs } from 'pinia'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import IconSprite from '@/components/interface/IconSprite.vue'

const { segment, directionSegments, idx } = defineProps(['segment', 'directionSegments', 'idx'])
const store = useAirSearchStore()
const { tariffs } = storeToRefs(store)

const durationTime = computed(() => {
    return (
        directionSegments[idx + 1]?.departureDate &&
        dayjs.utc(dayjs(directionSegments[idx + 1].departureDate).diff(dayjs(segment.arrivalDate))).format('H[ч] m[м]')
    )
})

const aviaComany = computed(() => {
    return tariffs.value.airlines.find((item) => item.code === segment.carrier)
})

const travelTime = computed(() => {
    const flightTime = dayjs.utc(dayjs(segment.arrivalDate).diff(dayjs(segment.departureDate))).format('H[ч] m[м]')
    return flightTime
})

const departureTime = computed(() => {
    return dayjs(segment.departureDate).format('HH:mm')
})

const arrivalTime = computed(() => {
    return dayjs(segment.arrivalDate).format('HH:mm')
})

const departureDate = computed(() => {
    return dayjs(segment.departureDate).locale('ru').format('D MMM YYYY')
})

const arrivalDate = computed(() => {
    return dayjs(segment.arrivalDate).locale('ru').format('D MMM YYYY')
})

const departureAirport = computed(() => {
    return tariffs.value.airports.find((item) => item.code === segment.origin)
})

const arrivalAirport = computed(() => {
    return tariffs.value.airports.find((item) => item.code === segment.destination)
})

const isTransfer = (idx) => {
    return directionSegments.length > 1 && idx < directionSegments.length - 1
}
</script>
<style scoped lang="scss">
.item4 {
    grid-column: 1 / -1;
}

.item-fullwidth {
    grid-column: 1 / -1;

    display: flex;
    align-items: center;
    justify-content: start;

    margin-bottom: 16px;
    padding: 16px;
    border-radius: 8px;
    background-color: $color-gray-6;
    word-break: break-word;
}
</style>
