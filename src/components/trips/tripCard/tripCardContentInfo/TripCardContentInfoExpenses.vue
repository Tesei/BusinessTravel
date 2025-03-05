<template>
    <div class="p-24 bd bd-gray-9 radius-16 flex flex-d-c ai-fs jc-fs trip-info">
        <div class="flex jc-sb ai-c trip-info__header">
            <div class="flex flex-d-c">
                <h2 class="Heading_4 trip-info__title">Расходы</h2>
                <div class="footnote_L">Создайте расход, чтобы оформить трэвел-услугу</div>
            </div>
            <base-button
                v-if="canCahngeExpenses"
                @click="router.push(`${tripId}/planning-expense`)"
                class="font-button_M button button_transparent_hover button_small"
            >
                <IconSprite
                    name="common--plus"
                    className="button__icon"
                />
                Расход
            </base-button>
        </div>
        <div
            v-for="item in services"
            :key="item.serviceId"
            class="flex jc-sb ai-c mt-24 trip-info__details"
        >
            <div class="flex flex-d-c ai-fs mr-24">
                <h3 class="footnote_L c-gray mb-8">Тип</h3>
                <div class="body_S">{{ getTypeExpense(item.expenseType) }}</div>
            </div>
            <div class="flex flex-d-c ai-fs">
                <h3 class="footnote_L c-gray mb-8">Лимит для покупки услуги</h3>
                <div class="body_S">{{ getLimitString(item) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import { useTripsStore } from '@/store/trips/index.js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const tripId = route.params.tripNumber

const tripsStore = useTripsStore()
const { singleTrip, getSingleTripStatus } = storeToRefs(tripsStore)
const services = computed(() => singleTrip.value.services)
const getTypeExpense = (type) => {
    switch (type) {
        case 'Plane':
            return 'Авиабилеты'
        case 'Train':
            return 'Билеты на поезд'
        default:
            return 'Авиабилеты'
    }
}
const getLimitString = (obj) => {
    return obj.limit.toLocaleString() + ' ₽ ' + obj.fromDirection.name + ' → ' + obj.toDirection.name
}

const statusForChangeData = ['Draft', 'Revoked', 'Rejected']
const canCahngeExpenses = computed(() => statusForChangeData.includes(getSingleTripStatus.value))
</script>

<style scoped lang="scss">
.trip-info {
    width: 100%;
}
.trip-info__header {
    width: 100%;
}
.trip-info__title {
    margin-bottom: 4px;
}
.trip-info__details {
    width: 100%;
    & > div {
        width: 50%;
    }
}
</style>
