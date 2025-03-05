<template>
    <div
        class="air__ticket"
        v-for="(segment, idx) in direction.segments"
        :key="idx"
    >
        <SegmentAirFlight
            :segment="segment"
            :directionSegments="directionSegments"
            :idx="idx"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import SegmentAirFlight from './SegmentAirFlight.vue'

const props = defineProps({
    direction: {
        type: Object,
        required: true,
    },
})

const directionSegments = computed(() => {
    return props.direction.segments
})
</script>

<style scoped lang="scss">
.air__ticket {
    display: grid;
    width: 100%;
    gap: 16px;
    word-break: break-word;
    grid-template-columns: auto 1fr;
}
</style>
