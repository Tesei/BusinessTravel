<template>
    <div class="flex flex-d-c mb-4 mt-32 planning-expense">
        <div class="flex jc-sb ai-c planning-expense__title">
            <h2 class="Heading_2">Планирование расходов</h2>
            <base-button
                class="font-button_S button button_transparent button_tiny button_no-border"
                @click="router.push(`/trips/${trip.id}`)"
            >
                <IconSprite
                    name="common--arrow_back"
                    className="icon__svg c-cornflower"
                />
                <span class="font-button_S c-cornflower">Назад к командировке </span>
            </base-button>
        </div>
    </div>
    <div class="mb-40">
        <div
            v-if="sortedDestinations"
            class="flex ai-fs footnote_L c-gray mb-40 planning-expense__subtitle"
        >
            <div>Для командировки &nbsp;</div>
                <span>{{ sortedDestinations }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import { useRouter } from 'vue-router'
import { useSortedDestinations } from '@/composables/useSorting'

const props = defineProps({
    trip: {
        type: Object,
        required: true,
    },
})
const router = useRouter()


const sortedStages = computed(() => {
    if (!props.trip.stages) {
        return []
    }
    return props.trip.stages?.toSorted((a, b) => {
        return a.position - b.position
    })
})

const sortedDestinations = useSortedDestinations(sortedStages)

</script>

<style scoped lang="scss">
.planning-expense__subtitle {
    margin-top: 4px;
}
</style>
