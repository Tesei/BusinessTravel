<template>
    <base-wrapper-popup-animated
        :show="showModal"
        @close="emit('close')"
    >
        <template #header><span class="Heading_3">Редактирование должности</span></template>
        <template #body>
            <div class="form-container">
                <positions-form
                    @submit="handleSubmit"
                    :preloader="preloader"
                    :initialData="formData"
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
    formData: {
        type: Object,
        required: true,
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
        const res = await positionsStore.putPosition(paiload, data.id)

        if (res.status >= 200 && res.status <= 299) {
            positionsStore.fetchPositions()
            emit('close')
        }
    } catch (error) {
        console.log('Error in handleSubmit when changing position:', error)
    }
}
</script>

<style lang="scss" scoped>
.form-container {
    width: 522px;
}
</style>
