<template>
    <div class="flex flex-d-c mb-40 trip-card-header">
        <div class="flex flex-d-r ai-c jc-fs mb-4 trip-card-header__subtitle">
            <div 
                class="flex ai-c radius-4 mr-12 trip-card-header__status"
                :class="statusColor"
            >
                <IconSprite
                    v-if="statusIcon"
                    :name="statusIcon"
                    className="trip-card-header__svg"
                />
                <span class="footnote_M">{{ statusName }}</span>
            </div>
            <div class="footnote_L c-gray">{{ useFormatDateRange(trip.startDate, trip.endDate) }}</div>
        </div>
        <div class="flex jc-sb ai-c trip-card__title">
            <div class="Heading_2 flex ai-c">
                <div>
                    <span>{{ sortedDestinations }}</span>
                </div>
            </div>
            <base-button
                class="font-button_S button button_transparent button_tiny button_no-border"
                @click="router.push(`/trips`)"
            >
                <IconSprite
                    name="common--arrow_back"
                    className="icon__svg c-cornflower"
                />
                <span class="font-button_S c-cornflower button-text">Назад к командировкам </span>
            </base-button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import { useRouter } from 'vue-router'
import { useFormatDateRange } from '@/composables/useFormatDateRange'
import { useSortedDestinations } from '@/composables/useSorting'

const props = defineProps({
    trip: {
        type: Object,
        required: true,
    },
    statusName: {
        type: String,
        required: true,
    },
    statusColor: {
        type: [String, Array],
        required: true,
    },
    statusIcon: {
        type: String,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
})
const router = useRouter()

const sortedStages = computed(() => {
    return props.trip.stages.toSorted((a, b) => {
        return a.position - b.position
    })
})

const sortedDestinations = useSortedDestinations(sortedStages)

</script>

<style scoped lang="scss">
.trip-card-header {
    .trip-card-header__status {
        padding: 4px 8px;

        .trip-card-header__svg {
            width: 12px;
            height: 18px;
        }
        span {
            margin-left: 4px;
        }
    }
    .button-text {
        width: 175px;
    }
}
</style>
