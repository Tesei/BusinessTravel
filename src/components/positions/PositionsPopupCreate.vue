<template>
    <base-wrapper-popup-animated
        :show="showModal"
        @close="emit('close')"
    >
        <template #header><span class="Heading_3">Создание должности</span></template>
        <template #body>
            <div class="form-container">
                <positions-form
                    @submit="handleSubmit"
                    :preloader="preloader"
                />
            </div>
        </template>
    </base-wrapper-popup-animated>
</template>

<script setup>
import BaseWrapperPopupAnimated from '@ui/wrapper/BaseWrapperPopupAnimated.vue'
import PositionsForm from '@/components/positions/PositionsForm.vue'

import { storeToRefs } from 'pinia'
import { usePositionsStore } from '@/store/positions'

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close'])

const positionsStore = usePositionsStore()
const { preloader } = storeToRefs(positionsStore)

const handleSubmit = async (data) => {
    try {
        const paiload = {
            departmentId: data.departments[0]?.id,
            name: data.name,
            code: data.code,
            description: data.description,
        }
        const res = await positionsStore.createPosition(paiload)

        if (res.status === 201) {
            positionsStore.fetchPositions()
            emit('close')
        }
    } catch (error) {
        console.log('Error in handleSubmit when creating a position:', error)
    }
}
</script>

<style lang="scss" scoped>
.form-container {
    width: 522px;
}
</style>
