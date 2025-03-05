<template>
    <base-wrapper-gray-border
        :class="{ 'mb-24': priceIndex !== prices.length - 1, 'mb-32': priceIndex === prices.length - 1 }"
        className="full-width"
    >
        <div class="offer-wrapper flex">
            <div class="offer-wrapper__tickets">
                <air-ticket
                    v-for="(direction, index) in routeLegs"
                    :key="index"
                    :class="{ 'mb-16': index !== routeLegs.length && routeLegs.length > 1 }"
                    :direction="direction"
                    :airlines="airlines"
                    :airports="airports"
                    :equipments="equipments"
                ></air-ticket>
            </div>
            <div class="offer-wrapper__info flex flex-d-c jc-sb">
                <div class="offer-wrapper__info_top flex flex-d-c ai-fe">
                    <div
                        v-if="itemPrice > tripLimit"
                        class="out-limit footnote_M c-white bg-red radius-100 mb-8"
                    >
                        Вне лимита
                    </div>
                    <div class="font-button_S c-gray">
                        Свободных мест <span class="c-black">{{ itemSeatsCount }}</span>
                    </div>
                </div>
                <div class="offer-wrapper__info_bottom flex flex-d-c ai-fe">
                    <div class="Heading_2 c-black mb-12"><span class="body_S">от</span> {{ itemPrice.toLocaleString() }} ₽</div>
                    <base-button
                        @click="selectTariff"
                        :disabled="itemPrice > tripLimit"
                        classNames="font-button_S button button_blue search-button"
                        >Выбрать тариф</base-button
                    >
                </div>
            </div>
        </div>
    </base-wrapper-gray-border>
</template>

<script setup>
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseWrapperGrayBorder from '@ui/wrapper/BaseWrapperGrayBorder.vue'
import AirTicket from '@/components/airSearch/AirTicket.vue'

import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const props = defineProps({
    prices: {
        type: Array,
        required: true,
    },
    priceIndex: {
        type: Number,
        required: true,
    },
    routeLegs: {
        type: Array,
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
    itemPrice: {
        type: Number,
        required: true,
    },
    itemSeatsCount: {
        type: Number,
        required: true,
    },
    tripLimit: {
        type: Number,
        required: true,
    },
    itemPriceKey: {
        type: String,
        required: true,
    },
    itemSearchCacheKey: {
        type: String,
        required: true,
    },
    isStrictCabinFiltering: {
        type: Boolean,
        default: true,
    },
})
const selectTariff = async () => {
    localStorage.setItem(
        'tariffSearch',
        JSON.stringify({
            priceKey: props.itemPriceKey,
            searchCacheKey: props.itemSearchCacheKey,
            isStrictCabinFiltering: props.isStrictCabinFiltering,
        }),
    )
    const tripNumber = route.params.tripNumber
    router.push({ name: 'air-price', params: { tripNumber: tripNumber } })
}
</script>

<style scoped lang="scss">
.offer-wrapper {
    // .offer-wrapper__tickets
    &__tickets {
        max-width: 517px;
        flex-grow: 1;
    }

    // .offer-wrapper__info
    &__info {
        max-width: 193px;
        flex-grow: 1;

        // .offer-wrapper__info_top
        &_top {
            .out-limit {
                padding: 0 8px 2px 8px;
            }
        }

        // .offer-wrapper__info_bottom
        &_bottom {
            & :deep(.button) {
                margin-top: 0;
                padding: 8px 20px;
                max-width: 150px;
            }
        }
    }
}
</style>
