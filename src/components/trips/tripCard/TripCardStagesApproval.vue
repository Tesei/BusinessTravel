<template>
    <div class="p-24 bd bd-gray-9 radius-16 flex flex-d-c ai-fs jc-fs stages-approval">
        <h2 class="Heading_4 mb-24">Этапы согласования</h2>
        
        <template v-if="tripsStore.preloader">
            <base-skeleton
                skeleton-height="45px"
                class="mt-20"
            />
        </template>

        <template v-else>
            <base-status-stepper v-if="showList" :steps="approveStore.getApproversStatusList" />
            <span v-else class="footnote_L status-stepper__no-data">Тут будем отображать согласующих</span>
        </template>

    </div>
</template>

<script setup>
import BaseStatusStepper from '@ui/status/BaseStatusStepper.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import { computed } from 'vue'

import { useApproveStore } from '@/store/approve/index.js'
const approveStore = useApproveStore()
import { useTripsStore } from '@/store/trips/index.js'
const tripsStore = useTripsStore()

const showList = computed(() => approveStore.getApproversStatusList.length !== 0)

</script>

<style scoped lang="scss">
.stages-approval {
    align-self: start;

    h2 {
        white-space: nowrap;
    }
}
</style>
