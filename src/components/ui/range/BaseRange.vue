<template>
    <div class="range-wrapper">
        <input
            id="range"
            class="range"
            type="range"
            :value="value"
            @input="updateValue"
            :min="min"
            :max="max"
        />
    </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
/**
 * @property {Number} min Минимальное значение
 * @property {Number} max Максимальное значение
 * @property {Number} modelValue текущее значение
 */
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    min: {
        type: Number,
        required: true,
    },
    max: {
        type: Number,
        required: true,
    },
    modelValue: {
        type: Number,
        required: true,
    },
})

const value = computed({
    get: () => props.modelValue,
    set: (newValue) => {
        emit('update:modelValue', newValue)
    },
})
const updateValue = (event) => {
    value.value = Number(event.target.value)
}
const setSliderBackground = (value) => {
    const selectPercent = ((value - props.min) / (props.max - props.min)) * 100
    document.getElementById('range').style.background =
        `linear-gradient(to right, #4872F2 ${selectPercent}%, #E9EAEC ${selectPercent}%)`
}
onMounted(() => {
    setSliderBackground(value.value)
})
watch(value, (newValue) => {
    setSliderBackground(newValue)
})
</script>

<style scoped lang="scss">
.range-wrapper {
    padding: 0;
}
.range {
    max-width: none;
}
</style>
