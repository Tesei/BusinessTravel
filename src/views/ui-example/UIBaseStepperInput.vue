<template>
    <base-input-stepper
        class="mb-16"
        :currentValue="10"
        :minValue="1"
        :maxValue="11"
        :isError="false"
        labelText="Ширина, см"
        v-model="firstStepperValue"
    />
    <base-input-stepper
        class="mb-16"
        :currentValue="10"
        :minValue="1"
        :maxValue="11"
        :isError="true"
        labelText="Ширина, см"
    />
    <base-input-stepper
        class="mb-16"
        :currentValue="10"
        :minValue="1"
        :maxValue="11"
    />
    <base-input-stepper
        class="mb-16"
        :currentValue="10"
        :minValue="1"
        :maxValue="11"
        :isError="true"
    />
    <base-input-stepper
        class="mb-16"
        :currentValue="10"
        :minValue="1"
        :maxValue="11"
        :isDisabled="true"
    />
    <base-input-stepper
        :width="326"
        :minValue="0"
        :currentValue="10"
        :maxValue="11"
        placeholder="Позиция"
        :isIconShow="true"
        :tooltip="{
            type: 'basic',
            font: 'footnote_M',
            range: 2,
            text: [
                'Позиция характеризует приоритет показа направления при получении списка. Самый высокий приоритет обозначается цифрой 0. Наименьший - цифрой 9.',
            ],
        }"
    />
</template>
<script setup>
import { ref } from 'vue'
import BaseInputStepper from '@/components/ui/inputs/BaseInputStepper.vue'

const firstStepperValue = ref(null)
</script>
<style scoped></style>
