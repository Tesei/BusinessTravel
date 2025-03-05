<template>
    <div class="planning-expense-body">
        <planning-expense-body-about-trip
            :trip="trip"
            :loading="loading"
        />
        <planning-expense-body-expenses-list
            :trip="trip"
            :loading="loading"
        />
    </div>
</template>
<script setup>
import PlanningExpenseBodyAboutTrip from '@/components/trips/planningExpense/PlanningExpenseBodyAboutTrip.vue'
import PlanningExpenseBodyExpensesList from '@/components/trips/planningExpense/PlanningExpenseBodyExpensesList.vue'
const props = defineProps({
    trip: {
        type: Object,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
})
</script>

<style scoped lang="scss">
.planning-expense-body {
    display: grid;
    grid-template-columns: 370px 776px;
    column-gap: 24px;
}
</style>
