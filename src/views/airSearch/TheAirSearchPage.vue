<template>
    <base-wrapper-component
        :is-show-button="false"
        v-if="step === 'search'"
    >
        <template #title>Поиск авиабилетов</template>
        <template #button>
            <div
                class="flex f-center"
                @click="returnToTripCard"
            >
                <IconSprite
                    name="common--arrow_back"
                    className="icon__svg c-cornflower"
                />
                Возврат к командировке
            </div>
        </template>
        <template #content>
            <base-wrapper-gray-border
                className="full-width ui-content__40"
                v-if="!preloader"
            >
                <template #header>
                    <h4 class="Heading_4 trip-info-header">Данные о поездке</h4>
                </template>
                <div class="trip-info mt-24 flex ai-c">
                    <div class="trip-info__item flex flex-d-c ai-fs">
                        <div class="c-gray footnote_L">ФИО командируемого</div>
                        <div class="c-black body_S mt-8">{{ tripInfo.employeeName }}</div>
                    </div>
                    <div class="trip-info__item flex flex-d-c ai-fs">
                        <div class="c-gray footnote_L">Город назначения</div>
                        <div class="c-black body_S mt-8">{{ tripInfo.toDirection }}</div>
                    </div>
                    <div class="trip-info__item flex flex-d-c ai-fs">
                        <div class="c-gray footnote_L">Даты командировки</div>
                        <div class="c-black body_S mt-8">{{ tripInfo.dates }}</div>
                    </div>
                </div>
            </base-wrapper-gray-border>
            <base-skeleton
                v-if="preloader"
                class="mt-40 radius-16"
                skeleton-height="158px"
            ></base-skeleton>
            <base-wrapper-gray-border
                v-if="!preloader"
                className="full-width ui-content__32"
            >
                <div class="big-air-search-form">
                    <div class="big-air-search-form__top-row flex-jcfs-aic mb-24">
                        <div
                            class="big-air-search-form__top-row_input"
                            v-click-outside="() => outside('from')"
                        >
                            <base-input
                                placeholder="Откуда"
                                v-model="fromInputValue"
                                v-maska="maskOptions"
                                @focus="fromIsActive = true"
                                maxlen="20"
                            ></base-input>
                            <airport-droplist
                                v-if="fromIsActive"
                                v-model:is-active="fromIsActive"
                                v-model:active-item="from"
                                position-y="bottom"
                                :line-count="6"
                                :list="fromList"
                                :preloader="fromPreloader"
                            ></airport-droplist>
                        </div>
                        <button
                            @click="fromToReverse"
                            class="big-air-search-form__top-row_btn flex-center"
                        >
                            <icon-sprite
                                name="common--sync"
                                class-name="sync-icon"
                            ></icon-sprite>
                        </button>
                        <div
                            class="big-air-search-form__top-row_input"
                            v-click-outside="() => outside('to')"
                        >
                            <base-input
                                placeholder="Куда"
                                v-model="toInputValue"
                                v-maska="maskOptions"
                                @focus="toIsActive = true"
                                maxlen="20"
                            ></base-input>
                            <airport-droplist
                                v-if="toIsActive"
                                v-model:is-active="toIsActive"
                                v-model:active-item="to"
                                position-y="bottom"
                                :line-count="6"
                                :list="toList"
                                :preloader="toPreloader"
                            ></airport-droplist>
                        </div>
                    </div>
                    <div class="big-air-search-form__middle-row flex-jcsb-aifs mb-24">
                        <div class="big-air-search-form__middle-row_input mr-24">
                            <base-input-date
                                placeholder="Туда"
                                v-model="startDate"
                                :min-date="minDateStart"
                                :max-date="maxDate"
                                :error-text="departureDateError"
                            />
                        </div>
                        <div class="big-air-search-form__middle-row_input mr-24">
                            <base-input-date
                                placeholder="Обратно"
                                v-model="endDate"
                                :min-date="minDateEnd"
                                :max-date="maxDate"
                                :error-text="returnDateError"
                                :disabled="tripItineraryType === 'Single'"
                            />
                        </div>
                        <div class="big-air-search-form__middle-row_select">
                            <base-select
                                type="big"
                                label="Пассажиры"
                                with-dropdown
                                :value="adult + ', ' + cabinClassSelectValue"
                                v-model="cabinClassIsActive"
                            >
                                <base-radio-droplist
                                    v-if="cabinClassIsActive"
                                    position-y="bottom"
                                    :list="Object.values(cabinClassGuide)"
                                    v-model:is-active="cabinClassIsActive"
                                    v-model:active-item="cabinClassModel"
                                >
                                    <div class="pt-16 pb-16 Heading_4">Класс обслуживания</div>
                                </base-radio-droplist>
                            </base-select>
                        </div>
                    </div>
                    <div class="big-air-search-form__bottom-row">
                        <div style="max-width: 159px">
                            <base-button
                                :disabled="getIsDisabledBtn"
                                @click="goToResultsStep"
                                classNames="font-button_M button button_blue search-button"
                                >Найти</base-button
                            >
                        </div>
                    </div>
                </div>
            </base-wrapper-gray-border>
            <base-skeleton
                v-if="preloader"
                class="mt-32 radius-16"
                skeleton-height="351px"
            ></base-skeleton>
        </template>
    </base-wrapper-component>
    <air-search-results-wrapper v-if="step === 'results'">
        <template #title>Поиск авиабилетов</template>
        <template #button>
            <div
                class="flex f-center"
                @click="returnToTripCard"
            >
                <IconSprite
                    name="common--arrow_back"
                    className="icon__svg c-cornflower"
                />
                Возврат к командировке
            </div>
        </template>
        <template #form>
            <div class="air-search-results-form flex-jcfs-aic p-24 bg-blue-2 radius-16">
                <div
                    class="air-search-results-form__l-field"
                    v-click-outside="() => outside('from')"
                >
                    <base-input
                        v-bind="searchInputLabelFont"
                        placeholder="Откуда: аэропорт, город"
                        v-model="fromInputValue"
                        v-maska="maskOptions"
                        @focus="fromIsActive = true"
                        maxlen="20"
                    ></base-input>
                    <airport-droplist
                        v-if="fromIsActive"
                        v-model:is-active="fromIsActive"
                        v-model:active-item="from"
                        position-y="bottom"
                        :line-count="6"
                        :list="fromList"
                        :preloader="fromPreloader"
                    ></airport-droplist>
                </div>
                <button
                    @click="fromToReverse"
                    class="air-search-results-form__change-btn flex-center"
                >
                    <icon-sprite
                        name="common--sync"
                        class-name="sync-icon"
                    ></icon-sprite>
                </button>
                <div
                    class="air-search-results-form__l-field"
                    v-click-outside="() => outside('to')"
                >
                    <base-input
                        v-bind="searchInputLabelFont"
                        placeholder="Куда: аэропорт, город"
                        v-model="toInputValue"
                        v-maska="maskOptions"
                        @focus="toIsActive = true"
                        maxlen="20"
                    ></base-input>
                    <airport-droplist
                        v-if="toIsActive"
                        v-model:is-active="toIsActive"
                        v-model:active-item="to"
                        position-y="bottom"
                        :line-count="6"
                        :list="toList"
                        :preloader="toPreloader"
                    ></airport-droplist>
                </div>
                <div class="air-search-results-form__sm-field">
                    <base-input-date
                        v-bind="searchInputLabelFont"
                        placeholder="Туда"
                        v-model="startDate"
                        :min-date="minDateStart"
                        :max-date="maxDate"
                        :error-text="departureDateError"
                    />
                </div>
                <div class="air-search-results-form__sm-field">
                    <base-input-date
                        v-bind="searchInputLabelFont"
                        placeholder="Обратно"
                        v-model="endDate"
                        :min-date="minDateEnd"
                        :max-date="maxDate"
                        :error-text="returnDateError"
                        :disabled="tripItineraryType === 'Single'"
                    />
                </div>
                <div class="air-search-results-form__sm-field">
                    <base-select
                        v-bind="searchInputLabelFont"
                        type="big"
                        label="Пассажиры"
                        with-dropdown
                        :value="adult + ', ' + cabinClassSelectValue"
                        v-model="cabinClassIsActive"
                    >
                        <base-radio-droplist
                            v-if="cabinClassIsActive"
                            position-y="bottom"
                            :list="Object.values(cabinClassGuide)"
                            v-model:is-active="cabinClassIsActive"
                            v-model:active-item="cabinClassModel"
                        >
                            <div class="pt-16 pb-16 Heading_4">Класс обслуживания</div>
                        </base-radio-droplist>
                    </base-select>
                </div>
                <div class="air-search-results-form__btn ml-12">
                    <base-button
                        :disabled="getIsDisabledBtn || flightsPreloader"
                        @click="fetchFlights"
                        classNames="font-button_M button button_blue search-button"
                        >Найти</base-button
                    >
                </div>
            </div>
        </template>
        <template #filters>
            <base-skeleton
                v-if="flightsPreloader"
                class="mb-24 radius-16"
                skeleton-height="68px"
            ></base-skeleton>
            <base-skeleton
                v-if="flightsPreloader"
                class="mb-24 radius-16"
                skeleton-height="84px"
            ></base-skeleton>
            <base-skeleton
                v-if="flightsPreloader"
                class="mb-24 radius-16"
                skeleton-height="446px"
            ></base-skeleton>
            <div
                v-if="!flightsPreloader"
                class="flex jc-sb ai-c bg-orange-2 radius-16 p-16 mb-24"
            >
                <div class="Heading_4">Лимит на покупку</div>
                <div class="font-button_M">{{ tripLimit.toLocaleString() }} ₽</div>
            </div>
            <div
                class="filters-trip-info"
                v-if="!flightsPreloader"
            >
                <base-wrapper-expanded
                    class="mb-24"
                    v-model="isTripInfoOpen"
                    placeholder="Данные о поездке"
                >
                    <div
                        v-if="isTripInfoOpen"
                        class="flex flex-d-c ai-fs mt-24"
                    >
                        <div class="flex flex-d-c ai-fs mb-24">
                            <div class="c-gray footnote_L">ФИО командируемого</div>
                            <div class="c-black body_S mt-8">{{ tripInfo.employeeName }}</div>
                        </div>
                        <div class="flex flex-d-c ai-fs mb-24">
                            <div class="c-gray footnote_L">Город назначения</div>
                            <div class="c-black body_S mt-8">{{ tripInfo.toDirection }}</div>
                        </div>
                        <div class="flex flex-d-c ai-fs mb-24">
                            <div class="c-gray footnote_L">Даты командировки</div>
                            <div class="c-black body_S mt-8">{{ tripInfo.dates }}</div>
                        </div>
                        <base-button
                            @click="returnToTripCard"
                            classNames="font-button_S button button_transparent"
                            >К командировке</base-button
                        >
                    </div>
                </base-wrapper-expanded>
                <air-filter
                    :minPrice="priceMinMax.minPrice"
                    :maxPrice="priceMinMax.maxPrice"
                    :departureTimeMin="departureTimeMinMax.min"
                    :departureTimeMax="departureTimeMinMax.max"
                    :arrivalTimeMin="arrivalTimeMinMax.min"
                    :arrivalTimeMax="arrivalTimeMinMax.max"
                    :airlines="airlines"
                    :airports="airports"
                />
            </div>
        </template>
        <template #results>
            <div
                class="flex-jcsb-aifs"
                :class="!flightsPreloader && !filteredPrices.length ? 'mb-40' : 'mb-24'"
            >
                <div :style="{ width: flightsPreloader ? '226px' : 'fit-content' }">
                    <base-skeleton
                        v-if="flightsPreloader"
                        class="radius-16"
                        skeleton-height="24px"
                    ></base-skeleton>
                    <div v-else>
                        <span class="body_S c-gray">Мы нашли </span>
                        <span class="body_S c-black"
                            >{{ filteredPrices.length }}
                            {{ inclineFilter(filteredPrices.length, ['предложение', 'предложения', 'предложений']) }}</span
                        >
                    </div>
                </div>

                <div
                    class="relative"
                    :style="{ width: flightsPreloader ? '130px ' : 'fit-content' }"
                >
                    <base-skeleton
                        v-if="flightsPreloader"
                        class="radius-16"
                        skeleton-height="24px"
                    ></base-skeleton>
                    <div
                        class="flex pointer"
                        @click="statePriceSort.isActive = !statePriceSort.isActive"
                        v-else
                    >
                        <span class="body_S c-cornflower mr-4 ai-c">Сортировать</span>
                        <IconSprite
                            :style="{ rotate: statePriceSort.activeItem === 'По возрастанию цены' ? '180deg' : '360deg' }"
                            name="common--sort_price"
                            className="icon__svg-price c-cornflower"
                        />
                    </div>
                    <div>
                        <base-droplist
                            v-if="statePriceSort.isActive"
                            position-x="right"
                            position-y="bottom"
                            :list="['По возрастанию цены', 'По убыванию цены']"
                            v-model:isActive="statePriceSort.isActive"
                            v-model:activeItem="statePriceSort.activeItem"
                            type="basic"
                            class="price-sort-droplist"
                        />
                    </div>
                </div>
            </div>
            <template v-if="flightsPreloader">
                <base-skeleton
                    v-for="n in 3"
                    :key="n"
                    class="mb-24 radius-16"
                    skeleton-height="368px"
                ></base-skeleton>
            </template>
            <template v-if="!flightsPreloader && filteredPrices.length">
                <div
                    class="footnote_L radius-8 bg-red-2 p-12 flex-jcfs-aic mb-24"
                    v-if="!areAvailableOffers"
                >
                    <icon-sprite
                        name="common--info"
                        class-name="icon-info mr-8"
                    ></icon-sprite>
                    Нет доступных предложений в рамках вашего лимита. Согласуйте повышение лимита.
                </div>
                <lazy-list
                    v-slot="{ data, index }"
                    :dataset="filteredPrices"
                    :initial-items="5"
                    :buffer="5"
                >
                    <lazy-list-item :min-height="50">
                        <air-offer
                            :trip-limit="tripLimit"
                            :item-price="data.price"
                            :item-seats-count="data.seatsCount"
                            :item-price-key="data.key"
                            :item-search-cache-key="data.cacheKey"
                            :airlines="airlines"
                            :airports="airports"
                            :equipments="equipments"
                            :route-legs="data.route.legs"
                            :price-index="index"
                            :prices="filteredPrices"
                        ></air-offer>
                    </lazy-list-item>
                </lazy-list>
            </template>
            <base-data-not-available
                class="mt-16"
                v-if="!flightsPreloader && !filteredPrices.length"
                @click="clearFilters"
                title="Поиск не дал результатов."
                description="Билеты на заданный маршрут и даты не найдены. Измените параметры поиска"
                buttonText="Сбросить фильтры"
            ></base-data-not-available>
        </template>
    </air-search-results-wrapper>
</template>

<script setup>
import { useAirSearchStore } from '@/store/airSearch/index.js'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseWrapperComponent from '@ui/wrapper/BaseWrapperComponent.vue'
import BaseWrapperGrayBorder from '@ui/wrapper/BaseWrapperGrayBorder.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import AirportDroplist from '@/components/airSearch/AirportDroplist.vue'
import { useDebounceRef } from '@/composables/useDebounceRef.js'
import { vMaska } from 'maska/vue'
import BaseInputDate from '@ui/inputs/BaseInputDate.vue'
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseRadioDroplist from '@ui/select/BaseRadioDroplist.vue'
import { getKeyByValue, inclineFilter } from '@/helpers/helpers.js'
import BaseButton from '@ui/buttons/BaseButton.vue'
import AirSearchResultsWrapper from '@/components/airSearch/AirSearchResultsWrapper.vue'
import BaseWrapperExpanded from '@ui/wrapper/BaseWrapperExpanded.vue'
import { LazyList, LazyListItem } from 'vue-lazy-list'
import AirOffer from '@/components/airSearch/AirOffer.vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import AirFilter from '@/components/airSearch/AirFilter.vue'
import BaseDroplist from '@ui/select/BaseDroplist.vue'
import { useFormatTimeToMinutes } from '@/composables/useFormatDateRange'

const airSearchStore = useAirSearchStore()
const {
    tripInfo,
    preloader,
    from,
    fromList,
    fromPreloader,
    to,
    toList,
    toPreloader,
    departureDate,
    departureDateError,
    returnDate,
    returnDateError,
    tripItineraryType,
    tripLimit,
    cabinClass,
    cabinClassGuide,
    adult,
    getIsDisabledBtn,
    flightsPreloader,
    airlines,
    airports,
    equipments,
    filteredPrices,
} = storeToRefs(airSearchStore)
const { fetchAirportList, fetchFlights, clearFilters, sortPrice } = airSearchStore

const router = useRouter()
const route = useRoute()

const maskOptions = {
    mask: 'A',
    tokens: {
        A: { pattern: /[а-яА-ЯёЁ-]/, repeated: true },
    },
}
const step = ref('search')
const fromInputValue = useDebounceRef('')
const fromIsActive = ref(false)
const toInputValue = useDebounceRef('')
const toIsActive = ref(false)
const cabinClassIsActive = ref(false)
const isTripInfoOpen = ref(false)
const statePriceSort = ref({ isActive: false, activeItem: 'По возрастанию цены' })

const searchInputLabelFont = ref({
    labelFont: 'footnote_L',
})

const startDate = computed({
    get: () => departureDate.value,
    set: (value) => (departureDate.value = value),
})

const endDate = computed({
    get: () => returnDate.value,
    set: (value) => (returnDate.value = value),
})

const minDateStart = computed(() => {
    return new Date().toISOString().slice(0, 10)
})

const minDateEnd = computed(() => {
    return startDate.value ? new Date(startDate.value).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
})

const maxDate = computed(() => {
    let date = new Date()
    return new Date(date.setFullYear(date.getFullYear() + 1)).toISOString().slice(0, 10)
})

const cabinClassModel = computed({
    get: () => cabinClassGuide.value[cabinClass.value],
    set: (value) => (cabinClass.value = getKeyByValue(cabinClassGuide.value, value)),
})

const cabinClassSelectValue = computed(() => {
    return cabinClassModel.value.toLowerCase()
})

const areAvailableOffers = computed(() => {
    return filteredPrices.value.some((el) => el.price < tripLimit.value)
})

const returnToTripCard = () => {
    router.push(`/trips/${route.params.tripNumber}`)
}

const outside = (type) => {
    if (type === 'from') {
        fromIsActive.value = false
        if (Object.keys(from.value).length) {
            if (from.value.name.includes('.')) fromInputValue.value = from.value.name.split('.')[0]
            else fromInputValue.value = from.value.name
        } else {
            fromInputValue.value = ''
        }
    }
    if (type === 'to') {
        toIsActive.value = false
        if (Object.keys(to.value).length) {
            if (to.value.name.includes('.')) toInputValue.value = to.value.name.split('.')[0]
            else toInputValue.value = to.value.name
        } else {
            toInputValue.value = ''
        }
    }
}

const fromToReverse = () => {
    let tempValue
    let tempList

    tempList = fromList.value
    fromList.value = toList.value
    toList.value = tempList

    tempValue = from.value
    from.value = to.value
    to.value = tempValue
}

const goToResultsStep = () => {
    step.value = 'results'
    fetchFlights()
}
const priceMinMax = computed(() => {
    return {
        minPrice: filteredPrices?.value ? filteredPrices?.value[0]?.price : 0,
        maxPrice: filteredPrices?.value ? filteredPrices?.value[filteredPrices.value.length - 1]?.price : 100,
    }
})
const departureTimeMinMax = computed(() => {
    const departureTimes = filteredPrices.value
        .flatMap((el) => el.route.legs[0].segments.map((segment) => segment.departureDate))
        .map((date) => useFormatTimeToMinutes(date))
        .sort((a, b) => a - b)

    const min = departureTimes[0]
    const max = departureTimes[departureTimes.length - 1]

    return { min, max }
})
const arrivalTimeMinMax = computed(() => {
    const arrivalTimes = filteredPrices.value
        .flatMap((el) => el.route.legs[0].segments.map((segment) => segment.arrivalDate))
        .map((date) => useFormatTimeToMinutes(date))
        .sort((a, b) => a - b)

    const min = arrivalTimes[0]
    const max = arrivalTimes[arrivalTimes.length - 1]

    return { min, max }
})
onMounted(() => {
    if (Object.keys(from.value).length) {
        if (from.value.name.includes('.')) fromInputValue.value = from.value.name.split('.')[0]
        else fromInputValue.value = from.value.name
    }
    if (Object.keys(to.value).length) {
        if (to.value.name.includes('.')) toInputValue.value = to.value.name.split('.')[0]
        else toInputValue.value = to.value.name
    }
})

watch(fromInputValue, (value) => {
    if (value.length > 2 && value.length < 20) {
        fetchAirportList({ type: 'from', search: fromInputValue.value })
    } else if (value.length < 3) {
        fromList.value = []
        from.value = {}
    }
})

watch(from, (value) => {
    if (Object.keys(value).length) {
        if (value.name.includes('.')) fromInputValue.value = value.name.split('.')[0]
        else fromInputValue.value = value.name
    }
})

watch(toInputValue, (value) => {
    if (value.length > 2 && value.length < 20) {
        fetchAirportList({ type: 'to', search: toInputValue.value })
    } else if (value.length < 3) {
        toList.value = []
        to.value = {}
    }
})

watch(to, (value) => {
    if (Object.keys(value).length) {
        if (value.name.includes('.')) toInputValue.value = value.name.split('.')[0]
        else toInputValue.value = value.name
    }
})

watch([startDate, endDate], (value) => {
    if ((value[0] && new Date(value[0]) < new Date(minDateStart.value)) || new Date(value[0]) > new Date(maxDate.value)) {
        departureDateError.value = 'Неверная дата'
    } else departureDateError.value = ''
    if ((value[1] && new Date(value[1]) < new Date(minDateEnd.value)) || new Date(value[1]) > new Date(maxDate.value)) {
        returnDateError.value = 'Неверная дата'
    } else returnDateError.value = ''
})
watch(statePriceSort.value, (newVal) => {
    //'По возрастанию цены', 'По убыванию цены'
    if (newVal.activeItem === 'По возрастанию цены') {
        sortPrice(1)
    } else {
        sortPrice(2)
    }
})
</script>

<style scoped lang="scss">
// .trip-info
.trip-info {
    gap: 24px;
    // .trip-info__item
    &__item {
        flex-grow: 1;
        white-space: nowrap;
    }
}
// .trip-info-header
.trip-info-header {
    padding: 4px 0;
}
// .big-air-search-form
.big-air-search-form {
    // .big-air-search-form__top-row
    &__top-row {
        // .big-air-search-form__top-row_input
        &_input {
            width: calc(50% - 24px);
            position: relative;
        }
        // .big-air-search-form__top-row_btn
        &_btn {
            width: 48px;
            height: 56px;
            .sync-icon {
                width: 24px;
                height: 24px;
                color: $color-gray;
            }
        }
    }
    // .big-air-search-form__middle-row
    &__middle-row {
        // .big-air-search-form__middle-row_input
        &_input {
            width: calc(25% - 24px);
        }
        // .big-air-search-form__middle-row_select
        &_select {
            width: 50%;
        }
    }
    // .big-air-search-form__bottom-row
    &__bottom-row {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        & :deep(.button) {
            margin: 0;
        }
    }
}

.air-search-results-form {
    height: 112px;
    // .air-search-results-form__l-field
    &__l-field {
        max-width: 248px;
        height: 100%;
        position: relative;
        flex-grow: 1;

        & :deep(.avia-drop__wrapper-list) {
            min-width: 336px;
        }
    }

    &__l-field:first-of-type {
        & :deep(.input__field) {
            border-radius: 8px 0 0 8px;
        }
    }

    &__l-field:nth-of-type(2) {
        & :deep(.input__field) {
            border-radius: 0;
        }
    }

    // .air-search-results-form__change-btn
    &__change-btn {
        height: 100%;
        width: 48px;
        background-color: $color-white;
        border: 1px solid $color-gray-3;
        .sync-icon {
            width: 24px;
            height: 24px;
            color: $color-gray;
        }
    }

    // .air-search-results-form__sm-field
    &__sm-field {
        max-width: 154px;
        height: 100%;
        flex-grow: 1;

        & :deep(.input__field) {
            border-radius: 0;
        }

        & :deep(.avia-drop__settings-wrapper) {
            min-width: 260px;
        }

        & :deep(.base-select-big) {
            height: 64px;
            border-radius: 0 8px 8px 0;
            background-color: $color-white;
        }
        & :deep(.base-select__label.active) {
            top: 8px;
        }
    }

    // .air-search-results-form__btn
    &__btn {
        width: 96px;
        height: 100%;

        & :deep(.button) {
            margin-top: 0;
            padding: 20px 20px 20px 24px;
        }
    }

    & :deep(.input__field) {
        min-height: 64px;
    }
}

.filters-trip-info {
    & :deep(.ui-expanded__header) {
        justify-content: flex-start;
    }

    & :deep(.ui-expanded__header_title) {
        width: fit-content;
    }

    & :deep(.button) {
        margin-top: 0;
        padding: 8px 20px;
    }
}

.icon-info,
.icon__svg-price {
    width: 24px;
    height: 24px;
}
.relative {
    position: relative;
}
.mr-4 {
    margin-right: 4px;
}
.price-sort-droplist {
    width: 245px;
    height: 124px;
}
</style>
