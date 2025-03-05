<template>
    <div>
        <base-notification-box-2
            v-if="!isReadyToBuy"
            class="mb-24 mt-24"
            :style="{ width: '100%' }"
            :always-visible="true"
            :color="'yellow'"
        >
            <template #picture>
                <IconSprite
                    name="common--time"
                    className="icon__svg"
                />
            </template>
            <template #default>
                <span>Купить билеты можно после согласования</span>
            </template>
        </base-notification-box-2>
        <div
            v-for="card in tripsStore.getServicesOfTrip"
            :key="card.tripServiceId"
        >
            <start-card-buy-ticket
                v-if="card.status === 'None' || card.status === 'New'"
                class="mb-24"
                :type-ticket="card.expenseType"
                :from="card.fromDirection.name"
                :to="card.toDirection.name"
                :limit="card.limit"
                :disabled="!isReadyToBuy"
                @click="setPickedTicket(card.tripServiceId)"
            />
        </div>
    </div>
</template>

<script setup>
import IconSprite from '@/components/interface/IconSprite.vue'
import StartCardBuyTicket from '@/components/trips/tripCard/tripCardContentTickets/StartCardBuyTicket.vue'
import BaseNotificationBox2 from '@ui/alert/BaseNotificationBox.vue'
import { computed } from 'vue'

import { useTripsStore } from '@/store/trips/index.js'
const tripsStore = useTripsStore()

import { useRouter } from 'vue-router'
const router = useRouter()

const isReadyToBuy = computed(() => tripsStore?.getSingleTripActions?.actions?.includes('Ticket'))

function setPickedTicket(tripServiceId) {
    router.push(`/${tripsStore.getSingleTrip.id}/air/search/${tripServiceId}`)
}
</script>

<style lang="scss" scoped></style>
