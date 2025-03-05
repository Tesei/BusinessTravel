<template>
    <base-wrapper-popup
        v-if="showModal"
        @close="emit('close')"
        :hasCloseIcon="true"
        class="fullwidth p-24"
    >
        <template #header
            ><h3 class="Heading_3 mb-16">{{ typeMap[type].title }}</h3>
        </template>
        <div class="flex flex-d-c">
            <div class="flex body_S mb-32">
                <div class="flex ai-c">
                    <span class="Heading_5">№{{ trip?.tripNumber }}</span>
                    <span class="dot bg-black"></span>
                    <span>{{ useFormatDateRange(trip?.startDate, trip?.endDate) }}</span>
                </div>
                <div class="ml-16">
                    <span class="">{{ shortName }}</span>
                </div>
            </div>
            <base-input
                class="mb-32"
                :placeholder="typeMap[type].placeholder"
                v-model="inputValue"
                maxlen="100"
            ></base-input>
            <base-button
                class="font-button_M button button_blue search-button jc-c"
                :disabled="!inputValue"
                @click="handleClick"
                >{{ typeMap[type].btnName }}</base-button
            >
        </div>
    </base-wrapper-popup>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseWrapperPopup from '@ui/wrapper/BaseWrapperPopup.vue'
import { useFormatDateRange } from '@/composables/useFormatDateRange'
import BaseInput from '@ui/inputs/BaseInput.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
    },
    trip: {
        type: Object,
    },
})

const inputValue = ref('')

const shortName = computed(() => {
    if (!props.trip) return
    const { firstName, lastName, middleName } = props.trip.employee
    return lastName + ' ' + (firstName?.[0] || '') + '. ' + (middleName?.[0] || '') + '.'
})

const emit = defineEmits(['close', 'handelCancelAction'])

const handleClick = () => {
    emit('handelCancelAction', props.trip?.id, inputValue.value)
    inputValue.value = ''
    emit('close')
}

const typeMap = {
    Revoke: {
        title: 'Отзыв для внесения изменений',
        placeholder: 'Укажите причину отзыва',
        btnName: 'Отозвать для внесения изменений',
    },
    Cancel: {
        title: 'Отмена командировки',
        placeholder: 'Укажите причину отмены',
        btnName: 'Отменить',
    },
    Reject: {
        title: 'Отклонение',
        placeholder: 'Укажите причину отклонения',
        btnName: 'Отклонить',
    },
}
</script>

<style scoped lang="scss">
.dot {
    display: inline-block;
    border: none;
    width: 4px;
    height: 4px;
    margin: 0 4px;
}
</style>
