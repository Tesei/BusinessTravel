<template>
    <planning-expense-wrapper>
        <template #header>
            <planning-expense-header :trip="getSingleTrip" />
        </template>
        <template #left>
            <planning-expense-body-about-trip
                :trip="getSingleTrip"
                :loading="preloader"
            />
        </template>
        <template #right>
            <planning-expense-body-expenses-list
                v-show="getSingleTrip.services && !preloader"
                :trip="getSingleTrip"
                :loading="preloader"
            />
            <div v-show="preloader">
                <base-skeleton
                    v-for="item in 3"
                    skeleton-height="154px"
                    class="mb-40"
                    :key="item"
                />
            </div>
        </template>
    </planning-expense-wrapper>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTripsStore } from '@/store/trips/index.js'
import { storeToRefs } from 'pinia'
import PlanningExpenseHeader from '@/components/trips/planningExpense/PlanningExpenseHeader.vue'
import PlanningExpenseBodyAboutTrip from '@/components/trips/planningExpense/PlanningExpenseBodyAboutTrip.vue'
import PlanningExpenseBodyExpensesList from '@/components/trips/planningExpense/PlanningExpenseBodyExpensesList.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import PlanningExpenseWrapper from '@/components/trips/planningExpense/PlanningExpenseWrapper.vue'

const tripsStore = useTripsStore()

const { getSingleTrip, preloader } = storeToRefs(tripsStore)
const { fetchSingleTrip } = tripsStore

const route = useRoute()
const tripId = route.params.tripNumber

onMounted(() => {
    if (getSingleTrip.value.id !== tripId) {
        fetchSingleTrip(tripId)
    }
})
</script>

<style scoped lang="scss"></style>
