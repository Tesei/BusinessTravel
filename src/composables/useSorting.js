import { computed } from 'vue'

export function useSortedDestinations(sortedStages) {
    return computed(() => {
        if (!sortedStages.value?.length) {
            return ''
        }
        const fromDirection = sortedStages.value?.[0]?.fromDirection?.name
        const destinations = sortedStages.value?.map((item) => item.toDirection.name)
        return `${fromDirection} → ${destinations?.join(' → ')} → ${fromDirection}`
    })
}