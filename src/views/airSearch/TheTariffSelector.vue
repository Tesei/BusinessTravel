<template>
    <base-wrapper-component :is-show-button="false">
        <template #title>Выбор тарифа</template>
        <template #button>
            <div
                class="flex f-center"
                @click="handleReturnToAvia"
            >
                <IconSprite
                    name="common--arrow_back"
                    className="icon__svg c-cornflower"
                />
                Назад к поиску авиабилетов
            </div>
        </template>
        <template #content>
            <div class="pt-40 flex">
                <div class="tariff-left-col">
                    <div
                        v-if="tripLimit"
                        class="tariff__limit bg-orange-2 radius-16 flex ai-c jc-sb p-16"
                    >
                        <span class="Heading_4 c-black">Лимит на покупку</span>
                        <span class="tariff__limit_price font-button_M c-black">{{ tripLimit.toLocaleString() }} ₽</span>
                    </div>
                    <base-skeleton
                        v-if="!tripLimit"
                        class="radius-16"
                        skeleton-height="68px"
                    ></base-skeleton>
                    <base-wrapper-gray-border
                        className="full-width m-0"
                        class="mt-24"
                    >
                        <div v-if="tripInfo.dates && tripInfo.toDirection && tripInfo.employeeName">
                            <div class="flex flex-d-r ai-c mb-16">
                                <span class="Heading_4 mr-4">Данные&nbsp;о&nbsp;поездке</span>
                                <base-select
                                    type="mini"
                                    :with-dropdown="false"
                                    v-model="isTripData"
                                />
                            </div>
                            <div
                                v-if="isTripData"
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
                                    @click="handleReturnToTripCard"
                                    classNames="font-button_S button button_transparent"
                                    >К командировке</base-button
                                >
                            </div>
                        </div>
                        <base-skeleton
                            v-if="!tripInfo.dates || !tripInfo.toDirection || !tripInfo.employeeName"
                            class="radius-16"
                            skeleton-height="392px"
                        ></base-skeleton>
                    </base-wrapper-gray-border>
                </div>
                <div class="tariff-right-col ml-40">
                    <base-wrapper-gray-border
                        className="full-width m-0"
                        class="wrapper mt-0"
                    >
                        <AirTicketFlightBlock
                            v-if="tariffs.prices"
                            :tariffs="tariffs"
                        />
                        <base-skeleton
                            v-if="!tariffs.prices"
                            class="radius-16"
                            skeleton-height="492px"
                        ></base-skeleton>
                        <div class="pt-24">
                            <h2
                                class="Heading_2 mb-24"
                                v-if="tariffs.prices"
                            >
                                Выберите тариф к выбранному рейсу
                            </h2>
                            <div
                                class="tariffs"
                                v-if="tariffs.prices"
                            >
                                <Swiper
                                    :modules="modules"
                                    class="mySwiper mb-24"
                                    :slidesPerView="3"
                                    :spaceBetween="12"
                                    :navigation="{
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                    }"
                                >
                                    <swiper-slide
                                        v-for="(tariff, index) in tariffs.prices"
                                        :key="index"
                                        class="slide"
                                    >
                                        <TariffItem
                                            :tariff="{ item: tariff, tariffIndex: index }"
                                            :isSelected="activeIndex === index"
                                            @selectedTariff="(text) => changeTotalPrice(text, index, tariff)"
                                        />
                                    </swiper-slide>
                                </Swiper>
                                <div class="swiper-button-next"></div>
                                <div class="swiper-button-prev"></div>
                            </div>
                            <div
                                class="total flex jc-sb"
                                :class="{ 'jc-fe': !totalPrice }"
                                v-if="tariffs.prices"
                            >
                                <span
                                    v-if="totalPrice"
                                    class="Heading_1 total__price"
                                    >{{ totalPrice.toLocaleString() }} ₽</span
                                >
                                <BaseButton
                                    @click="handleBuy()"
                                    :toShowLoading="preloader"
                                    :disabled="!tariff?.key"
                                    classNames="font-button_S button button_blue header__button button_buy"
                                    >Купить</BaseButton
                                >
                            </div>
                            <base-skeleton
                                v-if="!tariffs.prices"
                                class="radius-16"
                                skeleton-height="38px"
                            ></base-skeleton>
                            <base-skeleton
                                v-if="!tariffs.prices"
                                class="radius-16"
                                skeleton-height="264px"
                            ></base-skeleton>
                        </div>
                    </base-wrapper-gray-border>
                </div>
            </div>
        </template>
    </base-wrapper-component>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAirSearchStore } from '@/store/airSearch/index.js'
import BaseWrapperComponent from '@ui/wrapper/BaseWrapperComponent.vue'
import BaseWrapperGrayBorder from '@ui/wrapper/BaseWrapperGrayBorder.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import TariffItem from '@/components/airSearch/TariffItem.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'

import AirTicketFlightBlock from '@/components/airSearch/AirTicketFlightBlock.vue'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
const modules = [Navigation]

import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
const route = useRoute()
const router = useRouter()

const store = useAirSearchStore()
const { tariff, preloader, chosenTripServiceId } = storeToRefs(store)

const { fetchTariffs, tripInfo, tripLimit } = useAirSearchStore()
const isTripData = ref(true)
const tariffs = ref({})

const totalPrice = ref(null)
const activeIndex = ref(false)

onMounted(async () => {
    store.selectTariff(null)
    const searchObj = localStorage.getItem('tariffSearch')
    tariffs.value = await fetchTariffs(JSON.parse(searchObj))
})
const changeTotalPrice = (price, index, tariff) => {
    totalPrice.value = price
    activeIndex.value = index
    store.selectTariff(tariff)
}
const handleBuy = () => {
    router.push(`/${route.params.tripNumber}/air/order-create`)
}
const handleReturnToAvia = () => {
    router.push(`/${route.params.tripNumber}/air/search/${chosenTripServiceId.value}`)
}
const handleReturnToTripCard = () => {
    router.push(`/trips/${route.params.tripNumber}`)
}
</script>

<style scoped lang="scss">
.wrapper {
    width: 760px;
    position: relative;
}
.tariffs {
    position: relative;
    width: 713px;
}
.tariff-left-col {
    max-width: 370px;
    width: 100%;
}
.tariff-right-col {
    max-width: 760px;
    width: 100%;
}
.tariff__limit {
    height: 68px;
}
.button {
    margin-top: 0;
    padding: 8px;
}
.button_buy {
    max-width: 106px;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.mySwiper {
    overflow: visible;
}
.swiper-button-next,
.swiper-button-prev {
    color: $color-cornflower;
    background-color: $color-gray-5;
    font-weight: 700;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.swiper-button-next:after,
.swiper-button-prev:after {
    font-size: 10px;
    color: $color-cornflower;
    width: 6px;
    height: 10px;
}
.swiper-button-next {
    right: -12px;
}
.swiper-button-prev {
    left: -12px;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
    opacity: 0.5;
    transition: opacity 0.75s ease;
}
.slide {
    height: auto;
}
</style>
