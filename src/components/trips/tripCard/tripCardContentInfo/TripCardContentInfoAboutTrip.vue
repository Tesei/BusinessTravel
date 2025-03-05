<template>
    <div class="p-24 bd bd-gray-9 radius-16 flex flex-d-c ai-fs jc-fs trip-info">
        <div class="flex jc-sb ai-c mb-24 trip-info__header">
            <h2 class="Heading_4">Информация о командировке</h2>
            <base-button
                v-if="actions.includes('Edit')"
                class="font-button_M button button_transparent_hover button_tiny"
                @click="router.push(`${tripId}/edit`)"
            >
                <IconSprite
                    name="common--edit"
                    className="button__icon"
                />
                Редактировать
            </base-button>
        </div>
        <div class="flex jc-sb ai-c mb-24 trip-info__details">
            <div class="flex flex-d-c ai-fs mr-24">
                <h3 class="footnote_L c-gray mb-8">Командируемый</h3>
                <div class="body_S">{{ trip.employee?.fullName }}</div>
            </div>
            <div class="flex flex-d-c ai-fs">
                <h3 class="footnote_L c-gray mb-8">Даты командировки</h3>
                <div class="body_S">{{ useFormatDateRange(trip.startDate, trip.endDate) }}</div>
            </div>
        </div>

        <h2 class="Heading_4 mb-24">Маршрут</h2>
        <div class="flex jc-sb ai-c trip-info__details">
            <div class="flex flex-d-c ai-fs mr-24">
                <h3 class="footnote_L c-gray mb-8">Место отправления</h3>
                <div class="body_S">{{ fromDirection }}</div>
            </div>
            <div class="flex flex-d-c ai-fs">
                <h3 class="footnote_L c-gray mb-8">Место назначения</h3>
                <div class="body_S">
                    <span>{{ sortedDestinations}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useFormatDateRange } from '@/composables/useFormatDateRange'

const props = defineProps({
    trip: {
        type: Object,
        required: true,
    },
    actions: {
        type: Array,
        required: true,
    }
})

// сортируем, т.к. на бэке не реализована сортировка
const sortedStages = computed(() => {
    if (!props.trip.stages) {
        return []
    }
    return props.trip.stages.toSorted((a, b) => {
        return a.position - b.position
    })
})

const fromDirection = computed(() => {
    return sortedStages.value?.[0]?.fromDirection?.name  
})

const sortedDestinations = computed(() => {
    return sortedStages.value.map((item) => item.toDirection.name).join(', ')
})

const router = useRouter()

const route = useRoute()
const tripId = route.params.tripNumber
</script>

<style scoped lang="scss">
.trip-info {
    width: 100%;
    .trip-info__header {
        width: 100%;
    }
    .trip-info__details {
        width: 100%;
        & > div {
            width: 50%;
        }
    }
}
</style>
