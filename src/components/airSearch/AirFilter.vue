<template>
    <base-wrapper-gray-border
        class="wrapper"
        className="m-0"
    >
        <div class="mb-24">
            <div class="flex flex-d-r ai-c mb-16">
                <span class="Heading_4 mr-4">Пересадки</span>
                <base-select
                    type="mini"
                    :with-dropdown="false"
                    v-model="isTransfersActive"
                    class="small-svg ml-4"
                    v-bind="$attrs"
                />
            </div>
            <div v-if="isTransfersActive">
                <base-checkbox
                    v-for="item in selectedTransfers"
                    :key="item.id"
                    class="mb-12"
                    :label="item.name"
                    v-model="item.isActive"
                    :disabled="false"
                />
            </div>
        </div>
        <div class="mb-24">
            <div class="flex flex-d-r ai-c mb-16">
                <span class="Heading_4 mr-4">Цена</span>
                <base-select
                    type="mini"
                    :with-dropdown="false"
                    v-model="isPriceActive"
                    class="small-svg ml-4"
                />
            </div>
            <base-range-double
                v-if="isPriceActive"
                :min="frozenValues.minPrice.value"
                :max="frozenValues.maxPrice.value"
                v-model="doubleSliderValue"
                @mouseUp="filter('price')"
            >
                <template #minValueText>{{ `от&nbsp;${doubleSliderValue[0].toLocaleString('ru')}&nbsp;₽` }}</template>
                <template #maxValueText>{{
                    `до&nbsp;${doubleSliderValue[1].toLocaleString('ru')}&nbsp;₽`
                }}</template></base-range-double
            >
        </div>
        <div class="mb-24">
            <div class="flex flex-d-r ai-c mb-16">
                <span class="Heading_4 mr-4">Время&nbsp;вылета</span>
                <base-select
                    type="mini"
                    :with-dropdown="false"
                    v-model="isDepartureTime"
                    class="small-svg ml-4"
                />
            </div>
            <base-range-time
                v-if="isDepartureTime"
                :min="frozenValues.departureTimeMin.value"
                :max="frozenValues.departureTimeMax.value"
                :step="1"
                v-model="departureTimeRange"
                @mouseUp="filter('departureTime')"
            />
        </div>
        <div class="mb-24">
            <div class="flex flex-d-r ai-c mb-16">
                <span class="Heading_4 mr-4">Время&nbsp;прибытия</span>
                <base-select
                    type="mini"
                    :with-dropdown="false"
                    v-model="isArrivalTime"
                    class="small-svg ml-4"
                />
            </div>
            <base-range-time
                v-if="isArrivalTime"
                :min="frozenValues.arrivalTimeMin.value"
                :max="frozenValues.arrivalTimeMax.value"
                :step="1"
                v-model="arrivalTimeRange"
                @mouseUp="filter('arrivalTime')"
            />
        </div>
        <div class="mb-24">
            <div class="flex flex-d-r ai-c mb-16">
                <span class="Heading_4 mr-4">Авиакомпании</span>
                <base-select
                    type="mini"
                    :with-dropdown="false"
                    v-model="isAviacompanies"
                    class="small-svg ml-4"
                />
            </div>
            <base-select
                v-if="isAviacompanies"
                type="big"
                label="Авиакомпания"
                with-dropdown
                :value="stateAirlines.activeItem"
                v-model="stateAirlines.isActive"
                class="small-svg ml-4 avia-select"
            >
                <base-droplist
                    v-if="stateAirlines.isActive"
                    position-x="left"
                    position-y="bottom"
                    :list="airlines.map((el) => el.name)"
                    v-model:isActive="stateAirlines.isActive"
                    v-model:activeItem="stateAirlines.activeItem"
                    type="basic"
                    class="fullwidth"
                />
            </base-select>
        </div>
        <div>
            <div
                class="flex flex-d-r ai-c"
                :class="{ 'mb-16': isDepartureAirport }"
            >
                <span class="Heading_4 mr-4">Аэропорт&nbsp;вылета</span>
                <base-select
                    type="mini"
                    :with-dropdown="false"
                    v-model="isDepartureAirport"
                    class="small-svg ml-4"
                />
            </div>
            <div v-if="isDepartureAirport">
                <base-checkbox
                    v-for="airport in airportsList"
                    :key="airport.code"
                    class="airport mb-12"
                    :label="airport.name"
                    :disabled="false"
                    v-model="airport.isActive"
                />
            </div>
        </div>
    </base-wrapper-gray-border>
</template>
<script setup>
import BaseWrapperGrayBorder from '@ui/wrapper/BaseWrapperGrayBorder.vue'
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseCheckbox from '@ui/BaseCheckbox.vue'
import BaseRangeDouble from '@ui/range/BaseRangeDouble.vue'
import BaseRangeTime from '@ui/range/BaseRangeTime.vue'
import BaseDroplist from '@ui/select/BaseDroplist.vue'
import { useAirSearchStore } from '@/store/airSearch/index.js'
import { storeToRefs } from 'pinia'

import { ref, reactive, watch, onMounted } from 'vue'

const { applyFilters } = useAirSearchStore()

const { isFiltersCleared } = storeToRefs(useAirSearchStore())

const props = defineProps({
    minPrice: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
            return value >= 0
        },
    },
    maxPrice: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
            return value >= 0
        },
    },
    departureTimeMin: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
            return value <= 1440 && value >= 0
        },
    },
    departureTimeMax: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
            return value <= 1440 && value >= 0
        },
    },
    arrivalTimeMin: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
            return value <= 1440 && value >= 0
        },
    },
    arrivalTimeMax: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
            return value <= 1440 && value >= 0
        },
    },
    airlines: {
        type: Object,
        required: true,
        default: () => ({}),
        validator: (value) => {
            if (!value.length) return true
        },
    },
    airports: {
        type: Object,
        required: true,
        default: () => ({}),
        validator: (value) => {
            if (!value.length) return true
        },
    },
})

const isTransfersActive = ref(false)
const isPriceActive = ref(false)
const isDepartureTime = ref(false)
const isArrivalTime = ref(false)
const isAviacompanies = ref(false)
const isDepartureAirport = ref(false)
const selectedTransfers = ref([
    {
        id: 1,
        name: 'Без пересадок',
        isActive: false,
    },
    {
        id: 2,
        name: '1 пересадка',
        isActive: false,
    },
    {
        id: 3,
        name: '2 и более пересадок',
        isActive: false,
    },
])

const doubleSliderValue = ref([props.minPrice, props.maxPrice])
const departureTimeRange = ref([props.departureTimeMin, props.departureTimeMax])
const arrivalTimeRange = ref([props.arrivalTimeMin, props.arrivalTimeMax])

const stateAirlines = reactive({ isActive: false, activeItem: '' })
const airportsList = ref([])

const resultFilterObject = ref([])

const propsValues = {
    minPrice: props.minPrice,
    maxPrice: props.maxPrice,
    departureTimeMin: props.departureTimeMin,
    departureTimeMax: props.departureTimeMax,
    arrivalTimeMin: props.arrivalTimeMin,
    arrivalTimeMax: props.arrivalTimeMax,
}

const frozenValues = Object.fromEntries(
    Object.entries(propsValues).map(([key, value]) => {
        const refValue = ref(value)
        Object.freeze(refValue.value)
        return [key, refValue]
    }),
)
const filter = (type) => {
    if (type === 'price') {
        const priceValue = { priceMin: doubleSliderValue.value[0] - 1, priceMax: doubleSliderValue.value[1] }
        updateFilter('price', priceValue)
    }

    if (type === 'departureTime') {
        const departureTimeValue = { min: departureTimeRange.value[0], max: departureTimeRange.value[1] }
        updateFilter('departureTime', departureTimeValue)
    }
    if (type === 'arrivalTime') {
        const arrivalTimeValue = { min: arrivalTimeRange.value[0], max: arrivalTimeRange.value[1] }
        updateFilter('arrivalTime', arrivalTimeValue)
    }
    if (type === 'airlines') {
        const airlinesValue = props.airlines.filter((el) => el.name === stateAirlines.activeItem)[0]
        updateFilter('airlines', airlinesValue)
    }
    if (type === 'transfers') {
        const transfersValue = selectedTransfers.value.filter((el) => el.isActive === true).map((item) => item.id)
        updateFilter('transfers', transfersValue)
    }
    if (type === 'airport') {
        const airportValue = airportsList.value.filter((el) => el.isActive === true).map((item) => item.code)
        updateFilter('airport', airportValue)
    }
    applyFilters(resultFilterObject.value)

    function updateFilter(type, value) {
        const existingIndex = resultFilterObject.value.findIndex((item) => item[type] !== undefined)
        const newFilter = { [type]: value }

        if (existingIndex !== -1) {
            // Заменяем существующий фильтр
            resultFilterObject.value[existingIndex] = newFilter
        } else {
            // Добавляем новый фильтр
            resultFilterObject.value.push(newFilter)
        }
    }
}

watch(
    () => stateAirlines.activeItem,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            filter('airlines')
        }
    },
)

watch(
    selectedTransfers,
    () => {
        filter('transfers')
    },
    { deep: true },
)
watch(
    airportsList,
    () => {
        filter('airport')
    },
    { deep: true },
)
watch(isFiltersCleared, (newVal) => {
    if (newVal === true) {
        selectedTransfers.value.map((el) => (el.isActive = false))
        doubleSliderValue.value = [frozenValues.minPrice.value, frozenValues.maxPrice.value]
        departureTimeRange.value = [frozenValues.departureTimeMin.value, frozenValues.departureTimeMax.value]
        arrivalTimeRange.value = [frozenValues.arrivalTimeMin.value, frozenValues.arrivalTimeMax.value]
        stateAirlines.activeItem = ''
        airportsList.value.map((el) => (el.isActive = false))
    }
})
onMounted(() => {
    airportsList.value = props.airports
})
</script>
<style lang="scss" scoped>
.wrapper {
    max-width: 370px;
    overflow: visible;
}
.airport:last-of-type {
    margin: 0;
}
.avia-select {
    width: 100%;
    height: 56px;
}
</style>
