<template>
    <div class="air-ticket flex flex-d-c jc-fs p-16 radius-12 bg-gray-6">
        <div class="air-ticket__top flex ai-c jc-sb mb-16">
            <div class="air-ticket__top_numbers flex ai-c jc-fs">
                <div
                    v-for="(item, index) in flightNumbers"
                    :key="index"
                    class="air-ticket__numbers-item pointer mr-16"
                    :style="{ maxWidth: `calc(100% / ${flightNumbers.length} - 16px)` }"
                >
                    <base-tooltip
                        :range="0"
                        font="footnote_M"
                        type="basic"
                        :text="[item]"
                    >
                        <span class="footnote_L ellipsis">{{ item }}</span>
                    </base-tooltip>
                </div>
            </div>

            <div class="air-ticket__top_types">
                <base-tooltip
                    :range="8"
                    font="footnote_M"
                    type="basic"
                    :text="[planeTypes]"
                >
                    <span class="ellipsis footnote_L c-gray pointer">{{ planeTypes }}</span>
                </base-tooltip>
            </div>
        </div>
        <div class="air-ticket__bottom flex ai-fs jc-sb">
            <div class="air-ticket__bottom_departure flex flex-d-c jc-fs ai-fs pr-8">
                <div class="air-ticket__time Heading_3">{{ departureTime }}</div>
                <div class="air-ticket__city pointer">
                    <base-tooltip
                        :range="0"
                        font="footnote_M"
                        type="basic"
                        :text="[departureCity]"
                    >
                        <span class="font-button_S ellipsis">{{ departureCity }}</span>
                    </base-tooltip>
                </div>
                <div class="air-ticket__date footnote_M c-gray">{{ departureDate }}</div>
            </div>
            <div class="air-ticket__bottom_middle">
                <div class="air-ticket__airports flex ai-c jc-sb">
                    <template
                        v-for="(step, index) in flightSteps"
                        :key="index"
                    >
                        <template v-if="step.tooltip">
                            <div
                                v-if="!Array.isArray(step.step)"
                                class="air-ticket__airports_item"
                            >
                                <base-tooltip
                                    :range="0"
                                    font="footnote_M"
                                    type="basic"
                                    :text="step.tooltip"
                                >
                                    <span
                                        class="footnote_M pointer"
                                        :class="{ 'c-cornflower': index !== 0 && index !== flightSteps.length - 1 }"
                                        >{{ step.step }}</span
                                    >
                                </base-tooltip>
                            </div>
                            <div
                                v-else
                                class="air-ticket__airports_transfer"
                            >
                                <base-tooltip
                                    :range="0"
                                    font="footnote_M"
                                    type="basic"
                                    :text="step.tooltip"
                                >
                                    <div class="flex ai-c jc-c pointer">
                                        <div
                                            v-for="(step, index) in step.step"
                                            :key="index"
                                            :class="index % 2 === 0 ? 'air-ticket__airports_item' : 'air-ticket__airports_arrow'"
                                            class="footnote_M c-cornflower"
                                        >
                                            {{ step }}
                                        </div>
                                    </div>
                                </base-tooltip>
                            </div>
                        </template>
                        <template v-else>
                            <div
                                v-if="!Array.isArray(step.step)"
                                class="air-ticket__airports_item"
                            >
                                <span
                                    class="footnote_M"
                                    :class="{ 'c-cornflower': index !== 0 && index !== flightSteps.length - 1 }"
                                    >{{ step.step }}</span
                                >
                            </div>
                            <div
                                v-else
                                class="air-ticket__airports_transfer"
                            >
                                <div class="flex ai-c jc-c">
                                    <div
                                        v-for="(step, index) in step.step"
                                        :key="index"
                                        :class="index % 2 === 0 ? 'air-ticket__airports_item' : 'air-ticket__airports_arrow'"
                                        class="footnote_M c-cornflower"
                                    >
                                        {{ step }}
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div
                            v-if="index !== flightSteps.length - 1"
                            class="air-ticket__airports_line mr-8 ml-8"
                        ></div>
                    </template>
                </div>
                <div class="air-ticket__description-top footnote_M c-gray">{{ firstDescription }}</div>
                <div
                    v-if="countTechStops"
                    class="air-ticket__description-bottom footnote_M c-gray flex ai-c jc-c"
                >
                    {{ secondDescription }}
                    <icon-sprite
                        name="common--info"
                        className="c-gray air-ticket__info-icon pointer"
                    ></icon-sprite>
                </div>
            </div>
            <div class="air-ticket__bottom_arrival flex flex-d-c jc-fs ai-fe pl-8">
                <div class="air-ticket__time Heading_3">{{ arrivalTime }}</div>
                <div class="air-ticket__city pointer">
                    <base-tooltip
                        :range="0"
                        font="footnote_M"
                        type="basic"
                        :text="[arrivalCity]"
                    >
                        <span class="font-button_S ellipsis">{{ arrivalCity }}</span>
                    </base-tooltip>
                </div>
                <div class="air-ticket__date footnote_M c-gray">{{ arrivalDate }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseTooltip from '@ui/BaseTooltip.vue'
import { formatDate, timeBetween, sumAndFormatTimes, inclineFilter } from '@/helpers/helpers.js'
import IconSprite from '@/components/interface/IconSprite.vue'

const props = defineProps({
    direction: {
        type: Object,
        required: true,
    },
    airlines: {
        type: Array,
        required: true,
    },
    airports: {
        type: Array,
        required: true,
    },
    equipments: {
        type: Array,
        required: true,
    },
})

const directionSegments = computed(() => {
    return props.direction.segments
})

const flightNumbers = computed(() => {
    return directionSegments.value.map(
        (el) => `${props.airlines.find((item) => item.code === el.carrier).name} ${el.carrier} ${el.flightNumber}`,
    )
})

const planeTypes = computed(() => {
    return directionSegments.value
        .map((el) => {
            let plane = props.equipments.find((item) => item.code === el.equipment)
            return plane ? plane.internationalName : ''
        })
        .filter((el) => el !== '')
        .join(' / ')
})

const departureTime = computed(() => {
    return directionSegments.value[0].departureDate.split('T')[1].slice(0, 5)
})

const arrivalTime = computed(() => {
    return directionSegments.value[directionSegments.value.length - 1].arrivalDate.split('T')[1].slice(0, 5)
})

const departureCity = computed(() => {
    return props.airports.find((el) => el.code === directionSegments.value[0].origin).cityName
})

const arrivalCity = computed(() => {
    return props.airports.find((el) => el.code === directionSegments.value[directionSegments.value.length - 1].destination)
        .cityName
})

const departureDate = computed(() => {
    return formatDate(directionSegments.value[0].departureDate)
})

const arrivalDate = computed(() => {
    return formatDate(directionSegments.value[directionSegments.value.length - 1].arrivalDate)
})

const flightSteps = computed(() => {
    let steps = []
    directionSegments.value.forEach((el, index, arr) => {
        if (index === 0) {
            steps.push({ step: el.origin })
            if (el.landingsSegments.length) {
                steps.push({
                    step: el.landingsSegments[0].destination,
                    tooltip: [getTechStopTooltipString(el.landingsSegments[0].destination, el.landingsSegments[0].groundTime)],
                })
            }
        }
        if (index !== 0) {
            if (el.origin === arr[index - 1].destination) {
                steps.push({
                    step: el.origin,
                    tooltip: [getLayoverString(el.departureDate, arr[index - 1].arrivalDate, el.origin)],
                })
            } else {
                steps.push({
                    step: [arr[index - 1].destination, '→', el.origin],
                    tooltip: [
                        getTransferTooltipString(
                            el.departureDate,
                            arr[index - 1].arrivalDate,
                            arr[index - 1].destination,
                            el.origin,
                        ),
                    ],
                })
            }
            if (el.landingsSegments.length) {
                steps.push({
                    step: el.landingsSegments[0].destination,
                    tooltip: [getTechStopTooltipString(el.landingsSegments[0].destination, el.landingsSegments[0].groundTime)],
                })
            }
        }
        if (index === directionSegments.value.length - 1) {
            steps.push({ step: el.destination })
        }
    })
    return steps
})

const travelTime = computed(() => {
    let times = []
    directionSegments.value.forEach((el, index, arr) => {
        times.push(el.flightTime)
        if (index !== 0) {
            times.push(timeBetween(el.departureDate, arr[index - 1].arrivalDate, true))
        }
    })
    return sumAndFormatTimes(times)
})

const countTechStops = computed(() => {
    let count = 0
    directionSegments.value.forEach((el) => {
        if (el.landingsSegments.length) count++
    })
    return count
})

const countTransfers = computed(() => {
    return flightNumbers.value.length - 1
})

const firstDescription = computed(() => {
    let string = `в пути: ${travelTime.value}`
    if (!countTransfers.value && !countTechStops.value) string = string + ', прямой'
    if (countTransfers.value) {
        string =
            string + `, ${countTransfers.value} ${inclineFilter(countTransfers.value, ['пересадка', 'пересадки', 'пересадок'])}`
    }
    return string
})

const secondDescription = computed(() => {
    let string = ''
    if (countTechStops.value === 1) string = 'Техническая остановка'
    if (countTechStops.value > 1)
        string = `${countTechStops.value} ${inclineFilter(countTechStops.value, ['техническая остановка', 'технические остановки', 'технических остановок'])}`
    return string
})

const getTechStopTooltipString = (destination, groundTime) => {
    return `Техническая остановка в аэропорту ${
        props.airports.find((airport) => airport.code === destination).name
            ? props.airports.find((airport) => airport.code === destination).name
            : props.airports.find((airport) => airport.code === destination).internationalName
    } ${sumAndFormatTimes([groundTime.includes('.') ? groundTime.split('.')[1] : groundTime])}`
}

const getTransferTooltipString = (departureDate, arrivalDate, destination, origin) => {
    return `Пересадка ${timeBetween(departureDate, arrivalDate, false)}. Смена аэропорта с «${
        props.airports.find((airport) => airport.code === destination).name
            ? props.airports.find((airport) => airport.code === destination).name
            : props.airports.find((airport) => airport.code === destination).internationalName
    }» на «${
        props.airports.find((airport) => airport.code === origin).name
            ? props.airports.find((airport) => airport.code === origin).name
            : props.airports.find((airport) => airport.code === origin).internationalName
    }»`
}

const getLayoverString = (departureDate, arrivalDate, origin) => {
    return `Пересадка ${timeBetween(departureDate, arrivalDate, false)}. в аэропорту «${
        props.airports.find((airport) => airport.code === origin).name
            ? props.airports.find((airport) => airport.code === origin).name
            : props.airports.find((airport) => airport.code === origin).internationalName
    }»`
}
</script>

<style scoped lang="scss">
.air-ticket {
    // .air-ticket__top
    &__top {
        // .air-ticket__top_numbers
        &_numbers {
            flex-wrap: nowrap;
            max-width: calc(100% - 50px);
            flex-grow: 1;
        }

        // .air-ticket__top_types
        &_types {
            max-width: 200px;
            width: fit-content;
            min-width: 50px;

            & :deep(.tooltip) {
                max-width: max-content;
            }
        }
    }

    // .air-ticket__bottom
    &__bottom {
        // .air-ticket__bottom_departure
        &_departure {
            width: 96px;
        }

        // .air-ticket__bottom_middle
        &_middle {
            flex-grow: 1;
        }

        // .air-ticket__bottom_arrival
        &_arrival {
            width: 96px;
        }
    }

    // .air-ticket__time
    &__time {
        margin-bottom: 4px;
    }
    // .air-ticket__city
    &__city {
        max-width: 100%;
        margin-bottom: 2px;
        white-space: nowrap;
    }

    // .air-ticket__airports
    &__airports {
        margin-top: 31px;

        // .air-ticket__airports_line
        &_line {
            flex-grow: 1;
            height: 1px;
            background-color: $color-gray-3;
        }

        // .air-ticket__airports_arrow
        &_arrow {
            padding: 0 2px;
            margin-right: 4px;
            transform: translateY(-1px);
        }

        & :deep(.tooltip) {
            text-align: center;
            max-width: 341px;
        }
    }

    // .air-ticket__description-top
    &__description-top {
        margin-top: 4px;
        text-align: center;
    }

    // .air-ticket__description-bottom
    &__description-bottom {
        margin-top: 2px;
    }

    // .air-ticket__info-icon
    &__info-icon {
        width: 16px;
        height: 16px;
        margin-left: 4px;
    }
}
</style>
