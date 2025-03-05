<template>
    <BaseRangeInput
        class="mb-48 mt-48"
        :min="7000"
        :max="30000"
        v-model="sliderValue"
    />
    <BaseRangeDouble
        class="mb-48"
        :min="7000"
        :max="40000"
        v-model="doubleSliderValue"
    >
        <template #minValueText>{{ `от&nbsp;${doubleSliderValue[0]}&nbsp;₽` }}</template>
        <template #maxValueText>{{ `до&nbsp;${doubleSliderValue[1]}&nbsp;₽` }}</template>
    </BaseRangeDouble>
    <BaseRangeTime
        :min="0"
        :max="1440"
        :step="1"
        v-model="timeRange"
    />
</template>
<script setup>
import BaseRangeInput from '@ui/range/BaseRange.vue'
import BaseRangeDouble from '@ui/range/BaseRangeDouble.vue'
import BaseRangeTime from '@ui/range/BaseRangeTime.vue'
import { ref } from 'vue'

const sliderValue = ref(7500)
const doubleSliderValue = ref([7000, 40000])
const timeRange = ref([480, 1020]) // Пример: 08:00 - 17:00
/*
8 часов утра = 8 * 60 минут = 480 минут.
17 часов = 17 * 60 минут = 1020 минут.
*/
</script>
<style lang="scss"></style>
