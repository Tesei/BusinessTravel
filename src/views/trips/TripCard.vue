<template>
    <div class="mt-32">
        <trip-card-header
            v-if="getSingleTrip.status"
            :trip="getSingleTrip"
            :statusName="getStatusGuideNames[getSingleTrip.status]"
            :loading="preloader"
            :statusColor="getStatusGuideСolors[getSingleTrip.status]"
            :statusIcon="getStatusGuideIcons[getSingleTrip.status]"
        />
        <base-skeleton
            v-else
            class="mb-40"
            height="70px"
        />

        <trip-card-content
            :trip="getSingleTrip"
            :actions="arrActions"
        />
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import TripCardHeader from '@/components/trips/tripCard/TripCardHeader.vue'
import TripCardContent from '@/components/trips/tripCard/TripCardContent.vue'
import { useTripsStore } from '@/store/trips/index.js'
import { storeToRefs } from 'pinia'
import BaseSkeleton from '@ui/BaseSkeleton.vue'

const tripsStore = useTripsStore()

const { getSingleTrip, getStatusGuideNames, getStatusGuideСolors, getStatusGuideIcons,preloader, getSingleTripActions } = storeToRefs(tripsStore)
const { fetchSingleTrip, fetchActionsOfTripSingle } = tripsStore

const arrActions = computed(() => getSingleTripActions.value.actions || [])
const props = defineProps({
    tripNumber: {
        type: String,
        required: true,        
    }
})

onMounted(() => {
    fetchSingleTrip(props.tripNumber)
    fetchActionsOfTripSingle(props.tripNumber)
})
</script>

<style scoped lang="scss"></style>
