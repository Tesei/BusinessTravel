<template>
    <div>
        <div
            class="range-slider__text"
            :style="(moveText && setText) || `justify-content: unset`"
        >
            <div class="footnote_M mb-8"><slot name="minValueText"></slot></div>
            <div
                class="footnote_M mb-8"
                v-if="!moveText"
            >
                &nbsp;–&nbsp;
            </div>
            <div class="footnote_M mb-8"><slot name="maxValueText"></slot></div>
        </div>
        <div class="range-slider__wrapper">
            <div class="range-slider">
                <input
                    type="range"
                    class="slider"
                    :min="min"
                    :max="max"
                    :step="step"
                    v-model.number="localMinValue"
                    @input="setRangeSlider"
                    @mouseup="emit('mouseUp')"
                />
                <div class="tracks">
                    <div
                        class="track-before"
                        :style="setBeforeTrackWidth"
                    ></div>
                    <div
                        class="active-track"
                        :style="setActiveTrackWidth"
                    ></div>
                    <div
                        class="track-after"
                        :style="setAfterTrackWidth"
                    ></div>
                </div>
                <input
                    type="range"
                    class="slider"
                    :min="min"
                    :max="max"
                    :step="step"
                    v-model.number="localMaxValue"
                    @input="setRangeSlider"
                    @mouseup="$emit('mouseUp')"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAirSearchStore } from '@/store/airSearch/index.js'

const { isFiltersCleared } = storeToRefs(useAirSearchStore())
/**
 * @property {Number} min Минимальное значение
 * @property {Number} max Максимальное значение
 * @property {Number} modelValue текущее значение
 * @property {Number} step шаг изменения значения
 * @property {Number} moveText движение текста диапазона
 */
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
    step: {
        type: Number,
        default: 1,
    },
    moveText: {
        type: Boolean,
        default: true,
    },
})
const emit = defineEmits(['mouseUp'])

const model = defineModel()

const localMinValue = ref(0)
const localMaxValue = ref(100)

const setRangeSlider = () => {
    if (localMinValue.value > localMaxValue.value) {
        ;[localMinValue.value, localMaxValue.value] = [localMaxValue.value, localMinValue.value]
    }
    model.value = [localMinValue.value, localMaxValue.value]
}
const setBeforeTrackWidth = computed(() => {
    let tempWidth = (100 * (localMinValue.value - props.min)) / (props.max - props.min)
    return { width: `${tempWidth}%` }
})
const setAfterTrackWidth = computed(() => {
    let tempWidth = (100 * (props.max - localMaxValue.value)) / (props.max - props.min)
    return { width: `${tempWidth}%` }
})
const setActiveTrackWidth = computed(() => {
    let tempWidth = (100 * (localMaxValue.value - localMinValue.value)) / (props.max - props.min)
    return { width: `${tempWidth}%` }
})
const setText = computed(() => {
    let style = {}
    let tempWidthRight = (props.max - localMaxValue.value) / (props.max - props.min)
    let tempWidthPercentRight = 100 * tempWidthRight
    let textMarginRight = tempWidthPercentRight - 6 * tempWidthRight

    let tempWidthLeft = (localMinValue.value - props.min) / (props.max - props.min)
    let tempWidthPercentLeft = 100 * tempWidthLeft
    let textMarginLeft = tempWidthPercentLeft - 6 * tempWidthLeft

    if (textMarginLeft > 85) textMarginLeft = 85
    style = {
        marginLeft: `${textMarginLeft}%`,
        marginRight: `${textMarginRight}%`,
    }
    return style
})
onMounted(() => {
    localMinValue.value = props.min
    localMaxValue.value = props.max
})
watch(isFiltersCleared, (newVal) => {
    if (newVal === true) {
        localMinValue.value = props.min
        localMaxValue.value = props.max
    }
})
</script>
<style lang="scss" scoped>
.range-slider {
    width: 100%;
    text-align: center;
    position: relative;
}
.range-slider__wrapper {
    height: 11px;
}
.range-slider__text {
    margin-bottom: 15px;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
}

.range-slider input[type='range'] {
    width: 100%;
    position: absolute;
    right: 0;
}

.slider {
    -webkit-appearance: none;
    appearance: none;
}

.slider:focus {
    outline: none;
}

.slider::-webkit-slider-runnable-track {
    // background: $color-gray-4;
    height: 2px;
}

.slider::-ms-fill-lower {
    background: $color-gray-4;
    height: 2px;
}

.slider::-moz-range-progress {
    background: $color-gray-4;
    height: 2px;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    z-index: 2;
    top: -9px;
    position: relative;
    width: 22px;
    height: 22px;
    background: $color-white;
    border: 2px solid $color-cornflower;
    border-radius: 50%;
    cursor: pointer;
}

.tracks {
    position: absolute;
    // background: $color-gray-4;
    width: 100%;
    height: 2px;
    left: 0;
    z-index: 1;
    display: flex;
}

.track-before {
    background: $color-gray-4;
    height: 2px;
}

.active-track {
    background: $color-cornflower;
    height: 1px;
}

.track-after {
    background: $color-gray-4;
    height: 2px;
}
</style>
